export const MODALITY = {
  ONSITE: 'onsite',
  REMOTE: 'remote',
  HYBRID: 'hybrid',
} as const;

export type Modality = (typeof MODALITY)[keyof typeof MODALITY];
