// eslint.config.mjs
import js from '@eslint/js'
import pluginNext from '@next/eslint-plugin-next'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignore Deno edge functions so Node rules don't lint them
  { ignores: ['supabase/functions/**'] },

  // Base JS/TS recommended rules
  js.configs.recommended,

  // Next.js rules (core-web-vitals)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { '@next/next': pluginNext },
    rules: {
      ...pluginNext.configs['core-web-vitals'].rules,
    },
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },
]
