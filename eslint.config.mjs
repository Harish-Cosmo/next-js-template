import coreWebVitals from 'eslint-config-next/core-web-vitals';

/* Next 16 removed `next lint`; lint is a separate command. `eslint-config-next`
   now ships a native flat config, so the subpath export is the config array. */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'next-env.d.ts',
      '*.tsbuildinfo',
    ],
  },
  ...coreWebVitals,
];

export default eslintConfig;
