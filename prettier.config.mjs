export default {
  printWidth: 120,
  singleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '^react$',
    '^react-dom(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@core/(.*)$',
    '^@features/(.*)$',
    '^@shared/(.*)$',
    '^@testing/(.*)$',
    '^@environments/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx'],
};
