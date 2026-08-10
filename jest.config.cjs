/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  // Source imports use explicit ".js" extensions on relative specifiers
  // (required by moduleResolution: nodenext) even though the files are
  // .ts/.tsx. Strip the extension so Jest's CJS-based resolver can find
  // the real source file.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    // .d.ts files carry no executable code.
    "!src/**/*.d.ts",
    // Barrel re-export files -- tests import the component directly, not
    // through index.ts, so these always read as 0% despite the real file
    // being fully covered. See .claude/rules/testing.md.
    "!src/**/index.{ts,tsx}",
    // Plain data, no behavior to assert beyond "the values are what they
    // are" -- testing.md exempts this explicitly; covered indirectly
    // through the components that consume the tokens.
    "!src/tokens/**",
  ],
  // Higher bar than an app repo: testing.md requires EVERY ui-kit component to
  // cover default render, every variant/size/state, interaction handlers, and
  // ARIA attributes -- and every MFE on the platform depends on this package,
  // so an untested component here breaks things far from where it was written.
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
