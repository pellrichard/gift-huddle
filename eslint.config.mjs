// eslint.config.mjs
import js from '@eslint/js'
import * as tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignore Deno/outputs
  { ignores: ['supabase/functions/**', '.next/**', 'node_modules/**'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript (fast, no type-check step)
  ...tseslint.configs.recommended,

  // TS/JSX + Next rules (converted to flat format)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@next/next': nextPlugin,          // ✅ object map, not array
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules, // pull just the rules
    },
  },
]
