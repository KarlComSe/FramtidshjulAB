import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json', // Ensure TypeScript project is referenced
        extraFileExtensions: ['.svelte'], // Added Svelte file recognition
      },
    },
    plugins: {
      sonarjs: sonarjs,
    },
    rules: {
      // Basic TypeScript rules that don't require type checking
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],

      // SonarJS rules (these don't require type information)
      'sonarjs/cognitive-complexity': ['error', 9],
      'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',

      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      complexity: ['error', { max: 10 }],
      'max-depth': ['error', { max: 3 }],
      'max-params': ['error', { max: 4 }],

      // Svelte specific
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/html-quotes': ['error', { prefer: 'double' }],
      'svelte/spaced-html-comment': 'error',
    },
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      globals: {
        $state: 'readonly',
        $derived: 'readonly',
        $effects: 'readonly',
        $props: 'readonly',
      },
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    // Configuration for config files
    files: ['*.config.js', '*.config.ts'],
    languageOptions: {
      parserOptions: {
        project: null, // Disable typed linting for config files
      },
    },
  }
);
