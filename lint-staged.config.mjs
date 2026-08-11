export default {
  // Formatting: every staged file Prettier understands.
  "*.{ts,tsx,js,jsx,mjs,cjs,json,md,css}": ["prettier --write"],

  // Lint + type-check + run only the tests related to staged TS/TSX files.
  // ESLint is scoped to the staged files; tsc --noEmit can't be scoped
  // (TypeScript needs the whole program) so it always runs in full, as does
  // the coverage check.
  //
  // The coverage step (test:coverage:warn) is advisory, not a gate: Jest's
  // exit code doesn't distinguish "a real test failed" from "coverage
  // dipped below the threshold," so making coverage non-blocking means this
  // whole step can no longer block the commit on anything, not just
  // coverage. That's a deliberate trade -- a real regression anywhere in
  // the suite is still caught above by --findRelatedTests (for what
  // changed) and, once ci-cd.md's pipeline exists, by CI's full-suite run
  // (comprehensive validation belongs there, not in every local commit --
  // see ci-cd.md). This step exists purely so a coverage dip is visible to
  // the developer immediately, not discovered later.
  "*.{ts,tsx}": (stagedFiles) => [
    `eslint --max-warnings=0 ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    `jest --bail --findRelatedTests --passWithNoTests ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    "tsc --noEmit",
    "npm run test:coverage:warn",
  ],
};
