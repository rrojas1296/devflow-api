import { TECH_ALIASES } from '../../infrastructure/constants/stack.constants';

export const hasTech = (text: string, tech: string): boolean => {
  const normalized = text.toLowerCase();

  const variants = TECH_ALIASES[tech] || [tech];

  return variants.some((variant) => {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(normalized);
  });
};
