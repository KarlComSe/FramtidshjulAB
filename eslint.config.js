import prettier from "eslint-config-prettier";
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        project: './tsconfig.json',  // Ensure TypeScript project is referenced
        extraFileExtensions: ['.svelte']  // Added Svelte file recognition
      }
    },
    rules: {
      // Strict TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // Svelte-specific rules
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/html-quotes': ['error', { prefer: 'double' }],
      'svelte/spaced-html-comment': 'error',
      
      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ["*/.svelte"],

    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    // Configuration for config files
    files: ["*.config.js", "*.config.ts"],
    languageOptions: {
      parserOptions: {
        project: null  // Disable typed linting for config files
      }
    }
  }
);