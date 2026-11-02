import { data } from 'react-router';
import { abilityContext } from '~/server/lib/authContext';
import {
  createProjectLink,
  deleteProjectLink,
  moveProjectLink,
  updateProjectLink,
} from '~/server/lib/projectLinks.server';
import { deleteProjectFile, moveProjectFile } from '~/server/lib/projectFiles.server';
import type { Route } from './+types/ProjectContentRoute';

/**
 * A route with no page of its own: the actions behind the file and link cards on a project's content tab, which the project
 * edit page and the initial content page both show.  The cards submit to it with fetchers, and React Router reloads the page
 * they're on afterward.
 */
export type ProjectContentActionBody =
  | { intent: 'deleteFile'; id: number }
  | { intent: 'moveFile'; id: number; destinationIndex: number }
  | { intent: 'createLink'; projectId: number; projectLinkAttributes: ProjectLinkAttributes }
  | { intent: 'updateLink'; id: number; projectLinkAttributes: ProjectLinkAttributes }
  | { intent: 'deleteLink'; id: number }
  | { intent: 'moveLink'; id: number; destinationIndex: number };

type ProjectLinkAttributes = { title: string; url: string; icon: string | null };

export async function action({ context, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const body = await request.json();

  switch (body.intent) {
    case 'deleteFile':
      await deleteProjectFile(ability, body.id);
      break;
    case 'moveFile':
      await moveProjectFile(ability, body.id, body.destinationIndex);
      break;
    case 'createLink':
    case 'updateLink': {
      const result =
        body.intent === 'createLink'
          ? await createProjectLink(ability, body.projectId, body.projectLinkAttributes)
          : await updateProjectLink(ability, body.id, body.projectLinkAttributes);
      if (!result.ok) {
        return data({ errors: result.errors }, { status: 422 });
      }
      break;
    }
    case 'deleteLink':
      await deleteProjectLink(ability, body.id);
      break;
    case 'moveLink':
      await moveProjectLink(ability, body.id, body.destinationIndex);
      break;
    default:
      throw new Response(null, { status: 400, statusText: 'Bad Request' });
  }

  return { done: body.intent };
}
