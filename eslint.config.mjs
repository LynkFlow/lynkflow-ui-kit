import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * Type-aware linting. `recommendedTypeChecked` uses the TypeScript program
 * (not just the syntax tree), so it catches what `tsc` alone won't --
 * floating promises, unsafe `any` propagation, misused async functions.
 *
 * This requires the repo to stay on a TypeScript version typescript-eslint
 * supports (currently >=4.8.4 <6.1.0). See tooling.md before bumping
 * TypeScript.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // Root-level TS files (jest.setup.ts) sit outside tsconfig's
          // `include: ["src"]`, so let the service type them with defaults
          // rather than failing to resolve a project for them.
          allowDefaultProject: ["jest.setup.ts", "*.config.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser },
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },

  {
    // Tests run in jsdom with Jest globals and intentionally use loose
    // typing in places (mock factories, partial fixtures).
    files: ["**/*.test.{ts,tsx}", "jest.setup.ts", "src/test/**"],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },

  {
    // Build/tooling config files are Node, not browser, and aren't part of
    // the src TypeScript program -- type-aware rules don't apply.
    files: ["*.config.{js,mjs,cjs,ts}", "*.config.*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: "module",
    },
    ...tseslint.configs.disableTypeChecked,
  },

  {
    // CommonJS config files specifically (jest.config.cjs) need CJS globals.
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.commonjs },
    },
  },
);
