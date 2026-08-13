import type { Config } from "tailwindcss";
import { color, radius, typography } from "./src/tokens/index.js";

/**
 * @lynkflow/ui-kit Tailwind theme.
 *
 * Design tokens live in exactly one place -- src/tokens/index.ts -- and
 * this config imports them directly instead of duplicating values here.
 * Anything brand-specific (colors, border radius, font family) is mapped
 * into Tailwind's theme; anything Tailwind's own default scale already
 * covers well (spacing steps, font-size steps, font-weight steps) is left
 * as Tailwind's built-in values rather than forcing a redundant second
 * mapping that could drift from Tailwind's own conventions.
 */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: color.primary,
        neutral: color.neutral,
        success: color.success,
        warning: color.warning,
        danger: color.danger,
        // Additive: enables `bg-danger-subtle` / `text-danger-subtle` for a
        // future Alert/Banner component -- see the Figma-sourced error
        // banner background in tokens/index.ts.
        "danger-subtle": color.dangerSubtle,
        info: color.info,
      },
      borderRadius: {
        none: radius.none,
        sm: radius.sm,
        DEFAULT: radius.md,
        md: radius.md,
        lg: radius.lg,
        full: radius.full,
      },
      fontFamily: {
        sans: [typography.fontFamily.base],
      },
    },
  },
} satisfies Config;
