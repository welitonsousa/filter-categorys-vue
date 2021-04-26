const { resolve } = require('path');
module.exports = {
  root: true,
  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:vue/essential',
    'prettier'
  ],

  plugins: [
    '@typescript-eslint',
    'vue',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  rules: {
    'prefer-promise-reject-errors': 'off',
    quotes: ['warn', 'single'],
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/no-non-null-assertion': 0,

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-unused-vars': [
      0,
      { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],

    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'ignoreVoid': 'on',
    '@typescript-eslint/no-unsafe-member-access': ['off'],
  }
}
