/**
 * LynkFlow design tokens -- raw, framework-agnostic values consumed by
 * @lynkflow/ui-kit components. Application repos import these rather than
 * redefining them locally. Most values are measured from the real Figma
 * login flow (see individual comments); `success`/`info` are still
 * placeholders pending a real source.
 */

export const color = {
  primary: {
    // 50/100/300: derived tints, not measured (Figma had no light tint).
    50: "#edfdf6",
    100: "#d1fae9",
    300: "#6deeb8",
    400: "#128c58", // Input field focus border
    500: "#0b5d3b", // primary "Login" button fill
    600: "#08462c", // button hover shade
    // 700/900: derived, extrapolated along the 500->600 step.
    700: "#052f1d",
    900: "#02130c",
  },
  neutral: {
    0: "#ffffff",
    50: "#f7f8fa",
    100: "#eceef1",
    200: "#e4e8ed", // Input field border
    300: "#c3c9d1",
    400: "#a3abb8", // Input field label color
    500: "#7c8592",
    700: "#3f4552",
    900: "#0f1115", // "Welcome Back" heading text
  },
  success: "#1f9d55", // placeholder, not yet Figma-backed
  warning: "#b7791f",
  danger: "#b42318", // "Account Locked" error banner text
  dangerSubtle: "#fee4e2", // same banner's background fill
  info: "#2f80ed", // placeholder, not yet Figma-backed
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
     * Separate stack, not appended to `base` -- Inter ships just enough
     * Arabic glyphs to get picked by the font matcher and render badly.
     * Applied via `html[lang="ar"]`; the app must actually load this font.
     */
    arabic: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', system-ui, sans-serif",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    // Measured: the "Welcome Back" heading on the login frame.
    "2xl": "32px",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  /** Unitless multipliers (x fontSize), measured ratios from the login flow. */
  lineHeight: {
    snug: 1.43,
    normal: 1.5,
    relaxed: 1.83,
  },
} as const;

export const tokens = {
  color,
  spacing,
  radius,
  typography,
} as const;

export type Tokens = typeof tokens;
