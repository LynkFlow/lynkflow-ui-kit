export default {
  // Formatting: every staged file Prettier understands.
  "*.{ts,tsx,js,jsx,json,md,css}": ["prettier --write"],

  // Type-check + run only the tests related to staged TS/TSX files.
  // tsc --noEmit can't be scoped to specific files (TypeScript needs the
  // whole program), so it ignores the injected file list and always runs
  // in full; jest --findRelatedTests uses the dependency graph to run only
  // the test files relevant to what changed, instead of the whole suite.
  "*.{ts,tsx}": (stagedFiles) => [
    `jest --bail --findRelatedTests --passWithNoTests ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    "tsc --noEmit",
  ],
};
