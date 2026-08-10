import react from "@lynkflow/config/eslint/react";

/**
 * Thin extends of the shared React ESLint layer (@lynkflow/config/eslint/react).
 * The ui-kit needs no rule overrides of its own -- if that ever changes, add
 * the override HERE, not by forking the shared config. See tooling.md.
 */
export default react({
  tsconfigRootDir: import.meta.dirname,
  // Root-level TS files outside tsconfig's `include: ["src"]`.
  allowDefaultProject: ["jest.setup.ts", "*.config.ts"],
});
