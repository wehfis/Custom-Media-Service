module.exports = {
    root: true,
    env: {
      node: true,
      es2020: true,
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/prefer-default-export': 'off',
      'class-methods-use-this': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      'no-underscore-dangle': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
    ignorePatterns: ['dist/**', '.eslintrc.js'],
  };