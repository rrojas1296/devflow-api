export const hasTech = (text: string, tech: string): boolean => {
  const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|\\W)${escaped}($|\\W)`, 'i');
  return regex.test(text);
};
