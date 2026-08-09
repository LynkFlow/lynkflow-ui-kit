import { defineConfig } from "tsup";

// NOTE: `dts` generation is handled by a separate `tsc --project
// tsconfig.build.json` step (see package.json "build:types"), not by
// tsup's built-in `dts` option.
//
// Why: tsup's dts bundler (rollup-plugin-dts) drives the TypeScript
// Compiler API programmatically. TypeScript 7.0.x (the new Go-native
// compiler) does not yet expose a stable version of that API — Microsoft
// has confirmed it lands in TypeScript 7.1 (~Oct 2026) — so `tsup --dts`
// crashes under TS 7.0.x. Plain `tsc` on the CLI is unaffected because it
// doesn't go through that programmatic wrapper.
//
// Once tsup/rollup-plugin-dts confirm TS 7.1 support, this can revert to
// `dts: true` and the separate tsc step + tsconfig.build.json can be
// removed.
export default defineConfig({
  entry: ["src/index.ts"],

  format: ["cjs", "esm"],

  dts: false,

  sourcemap: true,

  clean: true,

  external: ["react", "react-dom"],
});
