import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.strictTypeChecked,
  {
    // Base configuration for all files
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
      },
    },
  },
  {
    // TypeScript files configuration
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': ts.plugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
  {
    // Svelte files configuration
    files: ['**/*.svelte'],
    plugins: {
      '@typescript-eslint': ts.plugin,
      svelte: svelte.plugin,
    },
    languageOptions: {
      parser: svelte.parser,
      parserOptions: {
        parser: ts.parser,
        project: true,
      },
    },
    rules: {
      'svelte/valid-compile': 'error',
      'svelte/no-unused-svelte-ignore': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off',
    },
  },
  // Apply prettier last to override any conflicting rules
  prettier
);
