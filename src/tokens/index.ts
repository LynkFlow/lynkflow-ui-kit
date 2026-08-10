/**
 * LynkFlow design tokens.
 *
 * These are the raw, framework-agnostic values consumed by @lynkflow/ui-kit
 * components. Application repos should not redefine these values locally —
 * import them from here instead.
 */

export const color = {
  primary: {
    50: "#eef4ff",
    100: "#d9e6ff",
    300: "#8fb3ff",
    500: "#3366ff",
    600: "#254edb",
    700: "#1a3aad",
    900: "#0f2166",
  },
  neutral: {
    0: "#ffffff",
    50: "#f7f8fa",
    100: "#eceef1",
    300: "#c3c9d1",
    500: "#7c8592",
    700: "#3f4552",
    900: "#14161a",
  },
  success: "#1f9d55",
  warning: "#e0a100",
  danger: "#541d8f",
  info: "#2f80ed",
} as const;

export const spacing = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
} as const;

export const radius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  full: "9999px",
} as const;

export const typography = {
  fontFamily: {
    /** Latin / default UI font. */
    base: "'Inter', system-ui, -apple-system, sans-serif",

    /**
     * Arabic UI font. Kept as a SEPARATE stack rather than appended to
     * `base`, because Inter ships two Arabic glyphs -- just enough that the
     * browser's font matcher prefers Inter for Arabic text and renders it
     * badly, instead of falling through to a font that can actually draw the
     * script (positional forms, ligatures, diacritics).
     *
     * Applied globally by the ui-kit stylesheet via `html[lang="ar"]`, which
     * works because the Shell owns `<html lang>` (see i18n.md). Individual
     * components never switch fonts themselves.
     *
     * The app must actually LOAD this font (self-hosted @font-face or a
     * webfont link) -- a token only names it.
     */
    arabic: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', system-ui, sans-serif",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const tokens = {
  color,
  spacing,
  radius,
  typography,
} as const;

export type Tokens = typeof tokens;
