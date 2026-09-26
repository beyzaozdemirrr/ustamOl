const { defineConfig } = require('eslint/config');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const expo = require('eslint-plugin-expo');
const globals = require('globals');

module.exports = defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', '.expo/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, __DEV__: 'readonly', process: 'readonly' },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks, expo },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'no-undef': 'error',
    },
  },
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
