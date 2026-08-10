import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  // Single-step declaration generation. This works because the repo is on
  // TypeScript 6.x, whose classic programmatic compiler API tsup's dts
  // bundler (rollup-plugin-dts) depends on is stable. See tooling.md.
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
});
