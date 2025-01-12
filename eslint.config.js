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
  ...svelte.configs['flat/recommended'],
  ...ts.configs.strictTypeChecked, // Add strict type checking
  {
    // Specific rules for TypeScript files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Warning instead of error
      '@typescript-eslint/explicit-function-return-type': 'off', // Less strict about return types
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      'svelte/valid-compile': 'error',
      'svelte/no-unused-svelte-ignore': 'error',
      // More lenient rules for Svelte files
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off', // Svelte handles this differently
    },
  }
);
