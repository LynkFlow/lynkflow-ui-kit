import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/index.js";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Visual style of the button. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size of the button. Defaults to "md". */
  size?: ButtonSize;
  /** Shows a loading spinner alongside the label and disables interaction. */
  isLoading?: boolean;
  /** Button label / content. */
  children: ReactNode;
}

// `transition` (not `transition-colors`) so hover color and press-scale
// animate together (styling.md's Micro-interactions pattern). Scale is
// gated behind `motion-safe:` for reduced-motion users.
const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-semibold transition motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const sizeClassName: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600",
  secondary: "border-primary-500 bg-white text-primary-500 hover:bg-primary-50",
  danger: "bg-danger text-white hover:bg-danger/90",
  ghost: "bg-transparent text-primary-500 hover:bg-primary-50",
};

/** LynkFlow's standard Button -- the canonical button for every microfrontend. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled ?? isLoading;

    return (
      <button
        ref={ref}
        type={rest.type ?? "button"}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          baseClassName,
          sizeClassName[size],
          variantClassName[variant],
          // Last, so a caller's utility can override same-group defaults (utils/cn.ts).
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
