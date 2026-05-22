export const SOURCE = {
  LINKEDIN: 'linkedin',
  INDEED: 'indeed',
  COMPUTRABAJO: 'computrabajo',
} as const;

export type Source = (typeof SOURCE)[keyof typeof SOURCE];
