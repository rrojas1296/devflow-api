function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function hasTech(text: string, tech: string): boolean {
  const escaped = escapeRegex(tech);
  const regex = new RegExp(`(^|\\W)${escaped}($|\\W)`, 'i');
  return regex.test(text);
}
