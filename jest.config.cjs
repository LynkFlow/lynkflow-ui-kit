const react = require("@lynkflow/config/jest/react");

/** @type {import('jest').Config} */
module.exports = {
  ...react,
  moduleNameMapper: {
    ...react.moduleNameMapper,
    // Source imports use explicit ".js" extensions on relative specifiers
    // (required by moduleResolution: nodenext) even though the files are
    // .ts/.tsx. Strip the extension so Jest's CJS-based resolver can find
    // the real source file. This is a "library" (nodenext) concern, not a
    // "react vs node" one -- @lynkflow/config's jest/react preset doesn't
    // include it because an app-repo consumer (bundler resolution, no .js
    // extensions) would never need it. See tooling.md / lynkflow-config's
    // README for the reasoning.
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    ...react.collectCoverageFrom,
    // Plain data, no behavior to assert beyond "the values are what they
    // are" -- testing.md exempts this explicitly; covered indirectly
    // through the components that consume the tokens.
    "!src/tokens/**",
  ],
  // Higher bar than @lynkflow/config/jest/react's shared 85/80/85/85 floor:
  // testing.md requires EVERY ui-kit component to cover default render,
  // every variant/size/state, interaction handlers, and ARIA attributes --
  // and every MFE on the platform depends on this package, so an untested
  // component here breaks things far from where it was written. This is
  // exactly the "application-specific overrides stay local" escape hatch
  // tooling.md documents.
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
