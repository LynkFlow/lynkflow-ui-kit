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
  danger: "#d64545",
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
    base: "'Inter', system-ui, -apple-system, sans-serif",
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
