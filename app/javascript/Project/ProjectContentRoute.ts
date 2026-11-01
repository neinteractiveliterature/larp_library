import { appContext } from '../appContext';
import { withApolloErrors } from '../actionHelpers';
import type { ProjectLinkAttributes } from '../graphqlTypes.generated';
import {
  CreateProjectLinkDocument,
  DeleteProjectFileDocument,
  DeleteProjectLinkDocument,
  MoveProjectFileDocument,
  MoveProjectLinkDocument,
  UpdateProjectLinkDocument,
} from './mutations.generated';
import type { Route } from './+types/ProjectContentRoute';

/**
 * A route with no page of its own: the actions behind the file and link cards on a project's content tab, which the
 * project edit page and the initial content page both show.  The cards submit to it with fetchers, and React Router
 * reloads the page they're on afterward.
 */
export type ProjectContentActionBody =
  | { intent: 'deleteFile'; id: string }
  | { intent: 'moveFile'; id: string; destinationIndex: number }
  | { intent: 'createLink'; projectId: string; projectLinkAttributes: ProjectLinkAttributes }
  | { intent: 'updateLink'; id: string; projectLinkAttributes: ProjectLinkAttributes }
  | { intent: 'deleteLink'; id: string }
  | { intent: 'moveLink'; id: string; destinationIndex: number };

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const body = (await request.json()) as ProjectContentActionBody;

  return withApolloErrors(async () => {
    switch (body.intent) {
      case 'deleteFile':
        await apolloClient.mutate({ mutation: DeleteProjectFileDocument, variables: { id: body.id } });
        break;
      case 'moveFile':
        await apolloClient.mutate({
          mutation: MoveProjectFileDocument,
          variables: { id: body.id, destinationIndex: body.destinationIndex },
        });
        break;
      case 'createLink':
        await apolloClient.mutate({
          mutation: CreateProjectLinkDocument,
          variables: { projectId: body.projectId, projectLinkAttributes: body.projectLinkAttributes },
        });
        break;
      case 'updateLink':
        await apolloClient.mutate({
          mutation: UpdateProjectLinkDocument,
          variables: { id: body.id, projectLinkAttributes: body.projectLinkAttributes },
        });
        break;
      case 'deleteLink':
        await apolloClient.mutate({ mutation: DeleteProjectLinkDocument, variables: { id: body.id } });
        break;
      case 'moveLink':
        await apolloClient.mutate({
          mutation: MoveProjectLinkDocument,
          variables: { id: body.id, destinationIndex: body.destinationIndex },
        });
        break;
    }

    return { done: body.intent };
  });
}
