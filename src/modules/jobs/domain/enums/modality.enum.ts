export const MODALITY = {
  ONSITE: 'onsite',
  REMOTE: 'remote',
  HYBRID: 'hybrid',
} as const;

export type Modality = keyof typeof MODALITY;
