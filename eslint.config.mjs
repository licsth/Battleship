import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import tsPlugin from '@typescript-eslint/eslint-plugin';

// eslint-config-next already registers the `import`, `react`, `react-hooks`,
// `jsx-a11y`, `@next/next` and `@typescript-eslint` plugins, so below we only
// pull in the rule sets of the configs we extend, not their plugin definitions.
const tsRecommendedRules = Object.assign(
  {},
  ...tsPlugin.configs['flat/recommended'].map((c) => c.rules ?? {}),
);

export default defineConfig([
  globalIgnores(['backend/**', 'javaImpl/**']),

  ...nextCoreWebVitals,

  {
    settings: {
      ...importPlugin.flatConfigs.typescript.settings,
      'import/resolver': {
        ...importPlugin.flatConfigs.typescript.settings['import/resolver'],
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...tsRecommendedRules,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  prettierRecommended,

  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'import/order': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'react/jsx-key': 'off',
      curly: ['error', 'multi-line'],
      'no-console': 'off',
    },
  },
]);
