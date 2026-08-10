// Components
export { Button } from "./components/Button/index.js";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/Button/index.js";

// Design tokens
export { tokens, color, spacing, radius, typography } from "./tokens/index.js";
export type { Tokens } from "./tokens/index.js";

// Styling utilities
// `cn` is exported so consuming MFEs compose their own domain components with
// the same Tailwind conflict-resolution the ui-kit uses internally.
export { cn } from "./utils/index.js";
export type { ClassValue } from "./utils/index.js";
