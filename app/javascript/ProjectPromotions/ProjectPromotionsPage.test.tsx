import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as ProjectPromotionsPage from './ProjectPromotionsPage';
import { PromoteProjectMutationDocument, UnpromoteProjectMutationDocument } from './mutations.generated';
import { ProjectPromotionsPageQueryDocument } from './queries.generated';
import { ProjectSearchQueryDocument } from '../ProjectSearch/queries.generated';
import { buildConnection, buildProjectHeaders, resetFixtureIds } from '../../../test/javascript/fixtures';
import { MockedResponse, renderRouteModule, selectReactSelectOption } from '../../../test/javascript/testUtils';

function promotion(id: string, projectId: string, title: string, createdAt = '2026-03-04T12:00:00Z') {
  return {
    __typename: 'ProjectPromotion',
    id,
    createdAt,
    project: {
      __typename: 'Project',
      id: projectId,
      title,
      brand: { __typename: 'Brand', id: `brand-${projectId}`, slug: `brand-${projectId}` },
    },
  };
}

const promotionsMock = (promotions: ReturnType<typeof promotion>[]): MockedResponse => ({
  request: { query: ProjectPromotionsPageQueryDocument },
  result: { data: { projectPromotions: promotions } },
});

const projectSearchMock = (titles: string[]): MockedResponse => ({
  request: { query: ProjectSearchQueryDocument },
  variableMatcher: () => true,
  maxUsageCount: Number.POSITIVE_INFINITY,
  result: {
    data: {
      projects: buildConnection(titles.map((title) => ({ ...buildProjectHeaders({ title }), description: null }))),
      tagByName: null,
    },
  },
});

describe('ProjectPromotionsPage', () => {
  beforeEach(() => resetFixtureIds());

  it('lists the promoted projects and when the promotion started', async () => {
    renderRouteModule(ProjectPromotionsPage, {
      mocks: [promotionsMock([promotion('pr1', 'p1', 'Featured Larp', '2026-03-04T12:00:00Z')])],
    });

    expect(await screen.findByRole('heading', { name: 'Project promotions' })).toBeInTheDocument();
    const row = screen.getByText('Featured Larp').closest('tr') as HTMLElement;
    const expectedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(
      new Date('2026-03-04T12:00:00Z'),
    );
    expect(within(row).getByText(expectedDate)).toBeInTheDocument();
  });

  it('stops promoting a project after confirmation', async () => {
    const user = userEvent.setup();
    let unpromoted = false;
    renderRouteModule(ProjectPromotionsPage, {
      mocks: [
        promotionsMock([promotion('pr1', 'p1', 'Old Feature'), promotion('pr2', 'p2', 'Keeper')]),
        {
          request: { query: UnpromoteProjectMutationDocument, variables: { projectId: 'p1' } },
          result: () => {
            unpromoted = true;
            return {
              data: {
                unpromoteProject: {
                  __typename: 'UnpromoteProjectPayload',
                  projectPromotion: promotion('pr1', 'p1', 'Old Feature'),
                },
              },
            };
          },
        },
        // the reload after the promotion is removed
        promotionsMock([promotion('pr2', 'p2', 'Keeper')]),
      ],
    });

    const row = (await screen.findByText('Old Feature')).closest('tr') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText('Are you sure you want to stop promoting Old Feature?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK', hidden: true }));

    await waitFor(() => expect(unpromoted).toBe(true));
    await waitFor(() => expect(screen.queryByText('Old Feature')).not.toBeInTheDocument());
    expect(screen.getByText('Keeper')).toBeInTheDocument();
  });

  it('promotes a project chosen from the search', async () => {
    const user = userEvent.setup();
    let promotedId: unknown;
    renderRouteModule(ProjectPromotionsPage, {
      mocks: [
        promotionsMock([]),
        projectSearchMock(['Brand New Promotion', 'Something Else']),
        {
          request: { query: PromoteProjectMutationDocument },
          variableMatcher: (variables) => {
            promotedId = variables.projectId;
            return true;
          },
          result: {
            data: {
              promoteProject: {
                __typename: 'PromoteProjectPayload',
                projectPromotion: promotion('pr9', 'p9', 'Brand New Promotion'),
              },
            },
          },
        },
        // the reload after the project is promoted
        promotionsMock([promotion('pr9', 'p9', 'Brand New Promotion')]),
      ],
    });

    await screen.findByRole('heading', { name: 'Project promotions' });
    expect(screen.getByRole('button', { name: 'Promote' })).toBeDisabled();

    await selectReactSelectOption(user, screen.getByRole('combobox'), 'Brand New Promotion', { typeText: 'Brand' });
    await user.click(screen.getByRole('button', { name: 'Promote' }));

    expect(await screen.findByRole('cell', { name: 'Brand New Promotion' })).toBeInTheDocument();
    expect(promotedId).toBeDefined();
    // the picker is cleared once the promotion has gone through
    await waitFor(() => expect(screen.getByRole('button', { name: 'Promote' })).toBeDisabled());
  });

  it('shows the error if promoting fails', async () => {
    const user = userEvent.setup();
    renderRouteModule(ProjectPromotionsPage, {
      mocks: [
        promotionsMock([]),
        projectSearchMock(['Doomed Project']),
        {
          request: { query: PromoteProjectMutationDocument },
          variableMatcher: () => true,
          error: new Error('already promoted'),
        },
        // the reload after the failed promotion
        promotionsMock([]),
      ],
    });

    await screen.findByRole('heading', { name: 'Project promotions' });
    await selectReactSelectOption(user, screen.getByRole('combobox'), 'Doomed Project', { typeText: 'Doom' });
    await user.click(screen.getByRole('button', { name: 'Promote' }));

    expect(await screen.findByText(/already promoted/)).toBeInTheDocument();
  });
});
