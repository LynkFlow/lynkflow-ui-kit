import { color as tokenColor } from "../../tokens/index.js";
import { cn } from "../../utils/index.js";

export type LogoVariant = "full" | "mark" | "text";
export type LogoOrientation = "horizontal" | "vertical";
export type LogoSizePreset = "sm" | "md" | "lg";
/**
 * A named preset, or a custom mark height in pixels for full control over
 * the rendered size. A number is interpreted as the MARK's height -- the
 * wordmark's height and the mark/wordmark gap both scale proportionally
 * from it (see TEXT_TO_MARK_RATIO / GAP_TO_MARK_RATIO below), the same way
 * the three preset sizes do, so a custom size still looks like the same
 * logo, just bigger or smaller, not a different lockup.
 */
export type LogoSize = LogoSizePreset | number;
export type LogoColorPreset = "brand" | "dark" | "white" | "current";

/**
 * A named preset, or any literal CSS color value (a hex code, `rgb(...)`,
 * a CSS custom property reference, etc.) for full custom control. The
 * `& {}` intersection is a TS trick that keeps preset names showing up in
 * autocomplete -- a plain `LogoColorPreset | string` union collapses to
 * `string` and loses that.
 */
export type LogoColor = LogoColorPreset | (string & {});

export interface LogoProps {
  /** Which part of the lockup to render. Defaults to `"full"` (mark + wordmark). */
  variant?: LogoVariant;
  /** Layout when `variant="full"`. Defaults to `"horizontal"` (mark beside the wordmark). */
  orientation?: LogoOrientation;
  /**
   * Overall size: a named preset (`"sm"` | `"md"` | `"lg"`), or a number
   * giving the mark's exact height in pixels for full custom control (the
   * wordmark height and mark/wordmark gap scale proportionally from it).
   * Defaults to `"md"`.
   */
  size?: LogoSize;
  /**
   * Color of the mark (the "Y" glyph). A named preset (`"brand"` | `"dark"`
   * | `"white"` | `"current"`) or any literal CSS color value. Defaults to
   * `"brand"`.
   */
  markColor?: LogoColor;
  /**
   * Color of the wordmark ("LynkFlow" text). Same accepted values as
   * `markColor`. Defaults to `"dark"`.
   */
  textColor?: LogoColor;
  /**
   * Accessible name announced for the whole lockup regardless of which
   * variant is rendered -- the mark/text SVGs themselves are always
   * `aria-hidden` so this is the only thing screen readers get. Override
   * only if this specific instance needs different context.
   */
  ariaLabel?: string;
  className?: string;
}

// Resolved from the real brand assets (green-logo.svg / colored-logo.svg /
// white-logo.svg / brand-logo.svg), not invented -- see each preset's own
// source token. "current" opts out of a fixed color entirely so the mark or
// text can inherit whatever `color` the surrounding CSS already sets.
const colorPresets: Record<LogoColorPreset, string> = {
  brand: tokenColor.primary[500],
  dark: tokenColor.neutral[900],
  white: tokenColor.neutral[0],
  current: "currentColor",
};

function resolveLogoColor(
  value: LogoColor | undefined,
  fallback: LogoColorPreset,
): string {
  const input = value ?? fallback;
  return colorPresets[input as LogoColorPreset] ?? input;
}

// Discrete Tailwind height classes per PRESET size, not a computed/arbitrary
// runtime value -- these are literal strings Tailwind's build-time scanner
// can see. Used only when `size` is one of the three named presets; a
// custom numeric size bypasses these entirely (see resolveSizing below).
const markSizeClassName: Record<LogoSizePreset, string> = {
  sm: "h-5 w-auto",
  md: "h-7 w-auto",
  lg: "h-10 w-auto",
};

const textSizeClassName: Record<LogoSizePreset, string> = {
  sm: "h-[21px] w-auto",
  md: "h-[30px] w-auto",
  lg: "h-[43px] w-auto",
};

const gapClassName: Record<LogoSizePreset, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

// The mark/text ratio (text is ~1.064x the mark's height) and the
// gap-to-mark-height ratio (~0.377x) are both taken from the real combined
// artwork (colored-logo.svg), not guessed -- computed via svgpathtools
// against the actual path data. The three presets above snap this same
// ratio to the platform's spacing scale for the gap rather than an
// arbitrary fractional value; a custom numeric size uses the precise ratio
// directly since there's no discrete scale to snap to.
const TEXT_TO_MARK_RATIO = 1.0638;
const GAP_TO_MARK_RATIO = 0.3774;

interface ResolvedSizing {
  markClassName: string;
  textClassName: string;
  gapClassName?: string;
  markStyle?: { height: number };
  textStyle?: { height: number };
  gapStyle?: { gap: number };
}

function resolveSizing(size: LogoSize): ResolvedSizing {
  if (typeof size !== "number") {
    return {
      markClassName: markSizeClassName[size],
      textClassName: textSizeClassName[size],
      gapClassName: gapClassName[size],
    };
  }

  const markHeight = size;
  const textHeight = markHeight * TEXT_TO_MARK_RATIO;
  const gap = markHeight * GAP_TO_MARK_RATIO;

  return {
    markClassName: "w-auto",
    textClassName: "w-auto",
    markStyle: { height: markHeight },
    textStyle: { height: textHeight },
    gapStyle: { gap },
  };
}

// Mark ("Y" glyph). viewBox and path data are verbatim from green-logo.svg
// -- that file is already a tight, correctly-centered crop of just the
// mark (verified: its own 66x71 canvas already accounts for the stroke's
// half-width margin around the path centerline). stroke="currentColor"
// replaces the source file's hardcoded #0B5D3B so color is controlled by
// the `style` below instead.
function LogoMarkGlyph() {
  return (
    <>
      <path
        d="M5.92871 5.92889V21.7393C5.92871 34.3876 32.8064 29.6445 32.8064 42.2928"
        fill="none"
        stroke="currentColor"
        strokeWidth={11.8578}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M59.8064 5.92889V21.7393C59.8064 34.3876 32.9287 29.6445 32.9287 42.2928"
        fill="none"
        stroke="currentColor"
        strokeWidth={11.8578}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.8037 39.1308V64.4274"
        fill="none"
        stroke="currentColor"
        strokeWidth={11.8578}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

// Wordmark ("LynkFlow"). Path data is verbatim from colored-logo.svg's two
// text paths (fill="#0F1115" there, now "currentColor") -- "Lynk" (bold)
// and "Flow" (regular) are two separate, untouched path strings; the visual
// weight difference is already baked into their geometry, not a font
// property. They're wrapped in a translating <g> rather than hand-edited,
// so the letter shapes themselves are never touched -- only the group's
// position shifts to align with this component's own tight viewBox
// (computed from the real path data via svgpathtools, not eyeballed).
function LogoTextGlyph() {
  return (
    <g transform="translate(-103.352 -16.390)">
      <path
        d="M116.087 61.6712H132.769V71.502H103.352V19.22H116.087V61.6712ZM178.721 29.9445L152.655 91.2381H138.951L148.484 70.0869L131.578 29.9445H145.803L155.41 55.9365L164.943 29.9445H178.721ZM222.066 47.2229V71.502H209.405V48.9358C209.405 46.1554 208.685 43.9956 207.245 42.4564C205.805 40.9173 203.869 40.1477 201.436 40.1477C199.004 40.1477 197.067 40.9173 195.627 42.4564C194.187 43.9956 193.467 46.1554 193.467 48.9358V71.502H180.732V29.9445H193.467V35.4557C194.758 33.6186 196.496 32.1663 198.681 31.0989C200.866 30.0314 203.323 29.4976 206.054 29.4976C210.919 29.4976 214.805 31.074 217.709 34.2268C220.614 37.3797 222.066 41.7117 222.066 47.2229ZM253.718 71.502L241.057 54.0746V71.502H228.322V16.3899H241.057V46.8505L253.644 29.9445H269.358L252.08 50.7977L269.507 71.502H253.718Z"
        fill="currentColor"
      />
      <path
        d="M302.207 19.5924V25.1036H279.641V42.6054H297.962V48.1166H279.641V71.502H272.863V19.5924H302.207ZM314.57 16.3899V71.502H307.792V16.3899H314.57ZM320.975 51.0211C320.975 46.8505 321.881 43.1639 323.693 39.9615C325.505 36.759 327.975 34.3013 331.103 32.5884C334.231 30.8754 337.732 30.019 341.604 30.019C345.477 30.019 348.978 30.8754 352.106 32.5884C355.234 34.3013 357.704 36.7466 359.516 39.9242C361.328 43.1019 362.234 46.8008 362.234 51.0211C362.234 55.2414 361.303 58.9528 359.441 62.1553C357.58 65.3577 355.06 67.8278 351.882 69.5656C348.704 71.3034 345.179 72.1723 341.307 72.1723C337.483 72.1723 334.02 71.3034 330.917 69.5656C327.814 67.8278 325.381 65.3577 323.619 62.1553C321.856 58.9528 320.975 55.2414 320.975 51.0211ZM355.308 51.0211C355.308 47.7442 354.663 44.9638 353.372 42.6798C352.081 40.3959 350.393 38.6954 348.307 37.5783C346.222 36.4611 343.963 35.9026 341.53 35.9026C339.047 35.9026 336.776 36.4611 334.715 37.5783C332.655 38.6954 331.004 40.3959 329.763 42.6798C328.522 44.9638 327.901 47.7442 327.901 51.0211C327.901 54.3477 328.509 57.153 329.726 59.4369C330.942 61.7208 332.568 63.4214 334.604 64.5385C336.64 65.6556 338.874 66.2142 341.307 66.2142C343.739 66.2142 346.023 65.6432 348.158 64.5013C350.293 63.3593 352.019 61.6464 353.334 59.3624C354.65 57.0785 355.308 54.2981 355.308 51.0211ZM422.932 30.6892L410.197 71.502H403.196L393.365 39.105L383.534 71.502H376.534L363.724 30.6892H370.65L380.034 64.9481L390.163 30.6892H397.089L406.994 65.0226L416.229 30.6892H422.932Z"
        fill="currentColor"
      />
    </g>
  );
}

/**
 * LynkFlow's brand logo -- the mark, the wordmark, or both, in any color and
 * either orientation, from one component.
 *
 * This is the only place the brand assets (`green-logo.svg`, `white-logo.svg`,
 * `colored-logo.svg`, `brand-logo.svg`) live in code -- every real exported
 * file is reproducible as a prop combination on this component rather than
 * a separate asset:
 * - `green-logo.svg`   -> `<Logo variant="mark" markColor="brand" />`
 * - `white-logo.svg`   -> `<Logo variant="mark" markColor="white" />`
 * - `colored-logo.svg` -> `<Logo />` (the defaults: brand mark, dark text)
 * - `brand-logo.svg`   -> `<Logo markColor="white" textColor="white" />`
 *
 * The colored square backdrop sometimes shown behind a white/vertical
 * lockup (e.g. an app-icon-style treatment) is a container the consuming
 * page applies itself (e.g. `bg-primary-500 rounded-lg p-6`) -- it isn't
 * part of this component, the same way `Button` doesn't own the page
 * background it sits on.
 */
export function Logo({
  variant = "full",
  orientation = "horizontal",
  size = "md",
  markColor,
  textColor,
  ariaLabel = "LynkFlow",
  className,
}: LogoProps) {
  const showMark = variant === "full" || variant === "mark";
  const showText = variant === "full" || variant === "text";
  const sizing = resolveSizing(size);

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center",
        variant === "full" && (orientation === "vertical" ? "flex-col" : "flex-row"),
        variant === "full" && sizing.gapClassName,
        className,
      )}
      style={variant === "full" ? sizing.gapStyle : undefined}
    >
      {showMark && (
        <svg
          viewBox="0 0 66 71"
          aria-hidden="true"
          focusable="false"
          className={sizing.markClassName}
          style={{
            color: resolveLogoColor(markColor, "brand"),
            ...sizing.markStyle,
          }}
        >
          <LogoMarkGlyph />
        </svg>
      )}
      {showText && (
        <svg
          viewBox="0 0 320 75"
          aria-hidden="true"
          focusable="false"
          className={sizing.textClassName}
          style={{
            color: resolveLogoColor(textColor, "dark"),
            ...sizing.textStyle,
          }}
        >
          <LogoTextGlyph />
        </svg>
      )}
    </span>
  );
}

Logo.displayName = "Logo";
