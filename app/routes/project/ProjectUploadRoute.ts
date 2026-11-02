import { abilityContext, userContext } from '~/server/lib/authContext';
import { completeFileUpload, requestFileUpload } from '~/server/lib/projectFiles.server';
import { projectIdFromParam } from '~/server/lib/projects.server';
import type { Route } from './+types/ProjectUploadRoute';

/**
 * A route with no page of its own: the two requests a file upload makes of this server. The browser first asks where to send
 * the file (`request`), sends its bytes straight to storage, and then says it's done (`complete`) so the file is recorded.
 * It answers with JSON, since the browser's upload code calls it directly rather than through a fetcher.
 */
export async function action({ context, params, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const projectId = projectIdFromParam(params.projectId);
  const body = await request.json();

  if (body.intent === 'request') {
    const result = await requestFileUpload(ability, projectId, body);
    return result.ok
      ? Response.json({ upload: result.upload })
      : Response.json({ errors: result.errors }, { status: 422 });
  }

  if (body.intent === 'complete') {
    const user = context.get(userContext);
    if (!user) {
      throw new Response('Sign in to upload files', { status: 403, statusText: 'Forbidden' });
    }
    const result = await completeFileUpload(ability, user, projectId, body);
    return result.ok ? Response.json({ done: true }) : Response.json({ errors: result.errors }, { status: 422 });
  }

  throw new Response(null, { status: 400, statusText: 'Bad Request' });
}
