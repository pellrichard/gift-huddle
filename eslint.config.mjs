// eslint.config.mjs
import next from "eslint-config-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...next,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
];
