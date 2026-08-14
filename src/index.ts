// Components
export { Button } from "./components/Button/index.js";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/Button/index.js";

export { Input } from "./components/Input/index.js";
export type { InputProps, InputSize } from "./components/Input/index.js";

export { CodeDigit } from "./components/CodeDigit/index.js";
export type { CodeDigitProps } from "./components/CodeDigit/index.js";

export { Logo } from "./components/Logo/index.js";
export type {
  LogoProps,
  LogoVariant,
  LogoOrientation,
  LogoSize,
  LogoSizePreset,
  LogoColor,
  LogoColorPreset,
} from "./components/Logo/index.js";

// Design tokens
export { tokens, color, spacing, radius, typography } from "./tokens/index.js";
export type { Tokens } from "./tokens/index.js";

// Styling utilities
// `cn` is exported so consuming MFEs compose their own domain components with
// the same Tailwind conflict-resolution the ui-kit uses internally.
export { cn } from "./utils/index.js";
export type { ClassValue } from "./utils/index.js";
