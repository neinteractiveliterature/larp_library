import { Brand, Project } from './graphqlTypes.generated';

export function generateBrandPath(brand: Pick<Brand, 'slug'>): string {
  return `/brands/${brand.slug}`;
}

export function generateProjectPath(
  project: Pick<Project, 'title' | 'id'> & { brand: Pick<Brand, 'slug'> },
): string {
  return `${generateBrandPath(project.brand)}/projects/${project.id}-${project.title
    ?.replace(/[^0-9A-Za-z]/g, '-')
    .replace(/--+/, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')
    .toLowerCase()}`;
}

export function generateProjectSearchPath(params?: { q?: string; tag?: string }): string {
  if (params) {
    const urlSearchParams = new URLSearchParams(params);
    return `/projects?${urlSearchParams.toString()}`;
  }

  return '/projects';
}
