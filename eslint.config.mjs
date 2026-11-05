import eslintReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import sheriff from '@softarc/eslint-plugin-sheriff';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'src/app/core/api-client', '.generator']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      reactHooks.configs.flat.recommended,
      eslintReact.configs['recommended-typescript'],
      jsxA11y.flatConfigs.recommended,
      prettierRecommended,
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',

      'max-lines': ['error', 400],
      complexity: ['error', 20],
      eqeqeq: 'error',
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [sheriff.configs.all],
  },
  {
    files: ['src/app/core/logger/logger.ts', 'src/main.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/app/**/*-page.tsx', 'src/app/**/*-dialog.tsx'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@core/api-client/*'],
              allowTypeImports: true,
              message: 'A page or dialog reads data through its screen hook, never the API client.',
            },
          ],
        },
      ],
    },
  },
]);
