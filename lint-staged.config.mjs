export default {
  // Formatting: every staged file Prettier understands.
  "*.{ts,tsx,js,jsx,mjs,cjs,json,md,css}": ["prettier --write"],

  // Lint + type-check + run only the tests related to staged TS/TSX files.
  // ESLint is scoped to the staged files; tsc --noEmit can't be scoped
  // (TypeScript needs the whole program) so it always runs in full, as does
  // the coverage check.
  "*.{ts,tsx}": (stagedFiles) => [
    `eslint --max-warnings=0 ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    `jest --bail --findRelatedTests --passWithNoTests ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    "tsc --noEmit",
  ],
};
