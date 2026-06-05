export const TECH_ALIASES: Record<string, string[]> = {
  // frontend
  angular: ['angular'],
  react: ['react'],
  vue: ['vue'],
  nextjs: ['nextjs', 'next.js'],
  nuxt: ['nuxt', 'nuxtjs', 'nuxt.js'],
  vite: ['vite'],
  tailwindcss: ['tailwind', 'tailwindcss'],

  // mobile
  'react-native': ['react-native', 'react native'],
  flutter: ['flutter'],

  // backend
  nodejs: ['node', 'nodejs', 'node.js'],
  express: ['express', 'expressjs'],
  nestjs: ['nestjs', 'nest.js'],
  django: ['django'],
  dotnet: ['.net'],
  spring: ['spring', 'spring boot'],
  laravel: ['laravel'],

  // languages
  javascript: ['javascript', 'js'],
  typescript: ['typescript', 'ts'],
  python: ['python'],
  java: ['java'],
  go: ['golang'],
  php: ['php'],
  ruby: ['ruby'],
  'c#': ['c#', 'csharp'],
  'c++': ['c++', 'cpp'],

  // databases
  postgresql: ['postgresql', 'postgres', 'psql'],
  mysql: ['mysql'],
  mongodb: ['mongodb', 'mongo', 'mongo_db'],
  redis: ['redis'],

  // infra / cloud
  docker: ['docker'],
  kubernetes: ['kubernetes', 'k8s'],
  aws: ['aws', 'amazon web services'],
  firebase: ['firebase'],
  supabase: ['supabase'],

  // tools / libs
  git: ['git'],
  github: ['github'],
  graphql: ['graphql'],
  prisma: ['prisma'],
  jest: ['jest'],
  jwt: ['jwt'],
  'tanstack-query': ['react-query', 'tanstack query'],
  zustand: ['zustand'],
};
