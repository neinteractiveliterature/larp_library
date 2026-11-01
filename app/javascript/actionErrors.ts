// How a route action tells its page what the user got wrong: `{ errors: [...] }`, which shows up as the action's data.
// (Browser-safe: nothing here imports server code.)

export type ActionErrors = { errors: string[] };

/** The messages in an action's data (or a fetcher's), if it returned any */
export function getActionErrors(data: unknown): string[] {
  if (typeof data !== 'object' || data == null || !('errors' in data) || !Array.isArray(data.errors)) {
    return [];
  }
  return data.errors.filter((error): error is string => typeof error === 'string');
}
