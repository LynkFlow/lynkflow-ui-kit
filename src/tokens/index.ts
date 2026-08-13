/**
 * LynkFlow design tokens.
 *
 * These are the raw, framework-agnostic values consumed by @lynkflow/ui-kit
 * components. Application repos should not redefine these values locally —
 * import them from here instead.
 *
 * `color.primary`, `color.neutral[200]`, `color.neutral[900]`,
 * `color.danger`, `color.dangerSubtle`, `typography.fontSize["2xl"]`, and
 * `typography.lineHeight` were sourced from the real Lynk-Flow Figma file
 * (login flow page, "Login" / "Login/ locked account" frames) via the Figma
 * Dev Mode inspector — see each value's own comment for exactly which
 * component/property it was read from. `color.primary` replaces a
 * placeholder blue ramp that predated any real design; `color.warning` was
 * corrected to a real value given directly by the developer. `success` and
 * `info` are still placeholders pending a real source for them — don't
 * treat those two as verified.
 *
 * `color.primary[400]` and `color.neutral[400]` were added later, given
 * directly by the developer as the Input field's focus-border and label
 * colors respectively (correcting the Input component's first pass, which
 * had rendered the label above the field instead of floating inside it,
 * per Figma). Both were verified via HSL to sit on the same hue/saturation
 * line as their neighboring ramp steps, not invented shades.
 *
 * BREAKING for existing consumers: `color.primary`'s hex values changed
 * (blue -> the real brand green), and `color.danger` changed (placeholder
 * purple -> the real error red). Any repo already rendering `bg-primary-*`
 * or `bg-danger` will visibly change color on next install. Flag as a
 * major-version change per `.claude/rules/ui-kit.md` when this ships.
 */

export const color = {
  primary: {
    // 50/100/300 are algorithmically derived tints (same hue/saturation as
    // 500, lightness varied) -- not measured, since Figma only showed the
    // resting and hover button shades, not a light tint.
    50: "#edfdf6",
    100: "#d1fae9",
    300: "#6deeb8",
    // Measured: given directly by the developer as the Input field's focus
    // border color. Confirmed via HSL to sit on the exact same hue (~154.4°)
    // and saturation (~77%) as 500/600 -- a real ramp step, not a one-off.
    400: "#128c58",
    // Measured: fill of the primary "Login" button (button > button > Colors)
    // on the login flow's "Login" and "Login/ locked account" frames.
    500: "#0b5d3b",
    // Measured: given directly by the developer as the button's real hover
    // shade. Confirmed to sit on the same hue (~155°) and saturation (~79%)
    // as 500, just ~5 percentage points darker in lightness -- i.e. this
    // wasn't a guess that happened to match, the ramp-generation approach
    // for 500 was actually validated by a second real data point.
    600: "#08462c",
    // 700/900 are still derived -- extrapolated along the same hue/
    // saturation using the real 500->600 lightness step, not measured.
    // Re-derive if a real active/pressed shade ever turns up in Figma.
    700: "#052f1d",
    900: "#02130c",
  },
  neutral: {
    0: "#ffffff",
    50: "#f7f8fa",
    100: "#eceef1",
    // Measured: input-Field's border color (Email/Password fields, login frame).
    200: "#e4e8ed",
    300: "#c3c9d1",
    // Measured: given directly by the developer as the Input field's label
    // color (both the floating-up small label and the placeholder-sized
    // resting label). Confirmed via HSL to sit on the same hue (~217°) and
    // saturation (~13%) as 300/500 -- a real ramp step, not a one-off.
    400: "#a3abb8",
    500: "#7c8592",
    700: "#3f4552",
    // Measured: "Welcome Back" heading text color (was the placeholder
    // #14161a -- close, but this is the real value from Figma).
    900: "#0f1115",
  },
  // Not yet backed by a real Figma value -- still the original placeholder.
  success: "#1f9d55",
  // Provided directly by the developer (not independently re-verified
  // against a specific Figma frame the way primary/danger were).
  warning: "#b7791f",
  // Measured: "Account Locked" error heading + body text color, on the
  // "Login/ locked account" frame's error banner. Also confirmed directly
  // by the developer.
  danger: "#b42318",
  // Measured: the same error banner's background fill.
  dangerSubtle: "#fee4e2",
  // Not yet backed by a real Figma value -- still the original placeholder.
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
    // Measured: the "Welcome Back" heading on the login frame.
    "2xl": "32px",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  /**
   * Unitless line-height multipliers (multiply by the paired fontSize).
   * All three are measured ratios from the login flow, not invented
   * defaults -- they don't line up on a single clean scale because the
   * Figma file itself uses different ratios for different text roles:
   * - `snug` (14px/20px = 1.43): the "Forget Password?" link and the
   *   "Account Locked" error heading.
   * - `normal` (32px/48px = 1.5, and 16px/24px = 1.5): the "Welcome Back"
   *   heading, and the "Login" button label.
   * - `relaxed` (16px/29.25px = 1.83): the login subtitle paragraph
   *   ("Sign in to your LynkFlow account to continue.").
   */
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
