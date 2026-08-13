import globals from "globals";
import tseslint from "typescript-eslint";

import react from "@lynkflow/config/eslint/react";

/**
 * Thin extends of the shared React ESLint layer (@lynkflow/config/eslint/react).
 */
export default [
  ...react({
    tsconfigRootDir: import.meta.dirname,
    // Root-level TS files outside tsconfig's `include: ["src"]`.
    allowDefaultProject: ["jest.setup.ts", "*.config.ts"],
  }),

  // scripts/publish-local-force.mjs is a standalone dev-tooling script, not
  // part of this package's TS program. `allowDefaultProject` alone stops the
  // parsing error but still runs type-aware rules against a default program
  // that can't resolve real Node types, producing a wall of no-unsafe-*
  // false positives -- same treatment as the shared base config already
  // gives `*.config.*` files.
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
