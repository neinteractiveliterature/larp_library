export default function stringPresence(string: string | undefined | null): string | undefined {
  if (string == null) {
    return undefined;
  }

  if (string.trim().length === 0) {
    return undefined;
  }

  return string;
}
