module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '/*', // Ignore everything
    // Just allow files and directories that are needed
    '!/src',
    '!/sequelize',
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'warn',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'prettier/prettier': [
      2,
      {
        endOfLine: 'auto',
      },
    ],
    curly: 'error',
    'import/no-duplicates': 'error',

    // Await rules
    'require-await': 'off',
    '@typescript-eslint/require-await': ['warn'],
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],

    // Explicit accessibility
    '@typescript-eslint/explicit-member-accessibility': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              accessors: 'explicit',
              constructors: 'no-public',
              methods: 'explicit',
              properties: 'implicit',
              parameterProperties: 'explicit',
            },
          },
        ],
      },
    },
  ],
};
