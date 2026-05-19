// @ts-check
import eslint from '@eslint/js';
import { fileURLToPath } from 'node:url';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default [
  eslint.configs.recommended,
  {
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
