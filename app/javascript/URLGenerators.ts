export function generateBrandPath(brand: { slug: string }): string {
  return `/brands/${brand.slug}`;
}

export function generateProjectPath(project: {
  id: string | number;
  title?: string | null;
  brand: { slug: string };
}): string {
  return `${generateBrandPath(project.brand)}/projects/${project.id}-${project.title
    ?.replace(/[^0-9A-Za-z]/g, '-')
    .replace(/--+/, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')
    .toLowerCase()}`;
}

/** Where the file and link cards on a project's content tab send their changes (see Project/ProjectContentRoute.ts) */
export function generateProjectContentActionPath(project: {
  id: string | number;
  title?: string | null;
  brand: { slug: string };
}): string {
  return `${generateProjectPath(project)}/content`;
}

export function generateProjectSearchPath(params?: { q?: string; tag?: string }): string {
  if (params) {
    const urlSearchParams = new URLSearchParams(params);
    return `/projects?${urlSearchParams.toString()}`;
  }

  return '/projects';
}
