import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data } from 'react-router';

import ProjectPromotionsPage from '~/routes/project-promotions/ProjectPromotionsPage';
import type { ProjectPromotionData } from '~/.server/lib/projectPromotions.server';
import { mockFetchJson, renderRouteModule, selectReactSelectOption } from '../../testUtils';

function promotion(
  id: number,
  projectId: number,
  title: string,
  createdAt = '2026-03-04T12:00:00Z',
): ProjectPromotionData {
  return {
    id,
    createdAt: new Date(createdAt),
    project: { id: projectId, title, brand: { slug: `brand-${projectId}` } },
  };
}

/**
 * Renders the page with a stand-in for the server: the promotions it lists, and an action that records what was submitted
 * and changes that list the way the real one would (so React Router's reload afterward shows the change).
 */
function renderPromotionsPage(
  initial: ProjectPromotionData[],
  {
    projectsToPromote = [] as { id: number; title: string }[],
    respond = undefined as (() => unknown) | undefined,
  } = {},
) {
  let promotions = initial;
  const submitted: { intent: string; projectId: number }[] = [];
  mockFetchJson(() => projectsToPromote);

  renderRouteModule({
    default: ProjectPromotionsPage,
    loader: () => ({ projectPromotions: promotions }),
    action: async ({ request }: { request: Request }) => {
      const body = await request.json();
      submitted.push(body);
      if (respond) {
        return respond();
      }
      promotions =
        body.intent === 'unpromote'
          ? promotions.filter((p) => p.project.id !== body.projectId)
          : [
              ...promotions,
              promotion(99, body.projectId, projectsToPromote.find((p) => p.id === body.projectId)!.title),
            ];
      return { done: body.intent };
    },
  });
  return { submitted };
}

describe('ProjectPromotionsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('lists the promoted projects and when the promotion started', async () => {
    renderPromotionsPage([promotion(1, 11, 'Featured Larp', '2026-03-04T12:00:00Z')]);

    expect(await screen.findByRole('heading', { name: 'Project promotions' })).toBeInTheDocument();
    const row = screen.getByText('Featured Larp').closest('tr') as HTMLElement;
    const expectedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(
      new Date('2026-03-04T12:00:00Z'),
    );
    expect(within(row).getByText(expectedDate)).toBeInTheDocument();
  });

  it('stops promoting a project after confirmation', async () => {
    const user = userEvent.setup();
    const { submitted } = renderPromotionsPage([promotion(1, 11, 'Old Feature'), promotion(2, 12, 'Keeper')]);

    const row = (await screen.findByText('Old Feature')).closest('tr') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText('Are you sure you want to stop promoting Old Feature?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(screen.queryByText('Old Feature')).not.toBeInTheDocument());
    expect(submitted).toEqual([{ intent: 'unpromote', projectId: 11 }]);
    expect(screen.getByText('Keeper')).toBeInTheDocument();
  });

  it('promotes a project chosen from the search', async () => {
    const user = userEvent.setup();
    const { submitted } = renderPromotionsPage([], {
      projectsToPromote: [
        { id: 21, title: 'Brand New Promotion' },
        { id: 22, title: 'Something Else' },
      ],
    });

    await screen.findByRole('heading', { name: 'Project promotions' });
    expect(screen.getByRole('button', { name: 'Promote' })).toBeDisabled();

    await selectReactSelectOption(user, screen.getByRole('combobox'), 'Brand New Promotion', { typeText: 'Brand' });
    await user.click(screen.getByRole('button', { name: 'Promote' }));

    expect(await screen.findByRole('cell', { name: 'Brand New Promotion' })).toBeInTheDocument();
    expect(submitted).toEqual([{ intent: 'promote', projectId: 21 }]);
    // the picker is cleared once the promotion has gone through
    await waitFor(() => expect(screen.getByRole('button', { name: 'Promote' })).toBeDisabled());
  });

  it('shows what the server says is wrong with promoting', async () => {
    const user = userEvent.setup();
    renderPromotionsPage([], {
      projectsToPromote: [{ id: 31, title: 'Doomed Project' }],
      respond: () => data({ errors: ['Project is already being promoted.'] }, { status: 422 }),
    });

    await screen.findByRole('heading', { name: 'Project promotions' });
    await selectReactSelectOption(user, screen.getByRole('combobox'), 'Doomed Project', { typeText: 'Doom' });
    await user.click(screen.getByRole('button', { name: 'Promote' }));

    expect(await screen.findByText(/already being promoted/)).toBeInTheDocument();
    // the picker keeps its choice, so it can be retried
    expect(screen.getByRole('button', { name: 'Promote' })).toBeEnabled();
  });
});
