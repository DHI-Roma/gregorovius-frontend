import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['tests/**/*.{js,mjs}', 'playwright.config.js', 'vitest.config.js'],
    languageOptions: {
      ecmaVersion: 2022
    }
  }
];
