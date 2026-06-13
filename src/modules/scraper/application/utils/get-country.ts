import { countryPatterns } from '../../infrastructure/constants/countries.constants';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replaceAll(',', ' ')
    .replaceAll('-', ' ')
    .split(' ')
    .filter((t) => t !== '');

export const getCountry = (location: string): string => {
  const normalized = normalize(location);

  const country = countryPatterns.find(({ patterns }) => {
    return normalized.some((n) => patterns.includes(n));
  });
  if (country) return country.country;

  return 'latin_america';
};
