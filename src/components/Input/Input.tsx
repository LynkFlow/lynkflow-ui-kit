import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "../../utils/index.js";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "placeholder"
> {
  /** Floating label rendered inside the field; there's no separate `placeholder` prop. */
  label?: string;
  /** Appends the standard "*" indicator (business-domain.md). Visual only -- validation happens on submit. */
  isRequired?: boolean;
  /** Validation message. Renders the error state and replaces `helperText`. */
  error?: string;
  /** Hint text rendered below the field when there is no `error`. */
  helperText?: string;
  /** Size of the field. Defaults to "md". */
  size?: InputSize;
}

// Floating label: pure CSS via Tailwind `peer` + `:placeholder-shown`, which
// is why the <input> always gets `placeholder=" "` below instead of a real
// placeholder prop. Sizes are explicit Tailwind height steps (not derived
// from padding + line-height) with static pt/pb, so only the label moves.
const inputSizeClassName: Record<InputSize, string> = {
  sm: "h-11 px-2.5 pt-4 pb-1.5 text-sm",
  md: "h-13 px-3 pt-5 pb-1.5 text-base",
  lg: "h-15 px-3.5 pt-6 pb-1.5 text-lg",
};

// Danger has no ramp (single flat value), so its focus/hover states reuse
// the same flat `border-danger` rather than a nonexistent step.
const inputStateClassName = {
  default: "border-neutral-200 hover:border-neutral-300 focus:border-primary-400",
  error: "border-danger hover:border-danger focus:border-danger",
};

// No focus ring here (unlike styling.md's general pattern) -- Figma's spec
// for this field is just a border-color swap on focus, nothing else.
const inputBaseClassName =
  "peer w-full rounded-sm border bg-white font-sans text-neutral-900 placeholder-transparent transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 disabled:hover:border-neutral-200";

// Literal utility strings (not composed at runtime) so Tailwind's build-time
// scanner sees them. Floated top-*/leading-none values are solved against
// each size's own static pt so the label sits exactly 4px above the text.
const labelClassName: Record<InputSize, string> = {
  sm: cn(
    "text-sm top-1/2 -translate-y-1/2",
    "peer-focus:top-0.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:leading-none",
    "peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:leading-none",
  ),
  md: cn(
    "text-base top-1/2 -translate-y-1/2",
    "peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:leading-none",
    "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:leading-none",
  ),
  lg: cn(
    "text-lg top-1/2 -translate-y-1/2",
    "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:leading-none",
    "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:leading-none",
  ),
};

// Matches each size's own horizontal input padding so the label lines up
// with the typed text exactly.
const labelStartClassName: Record<InputSize, string> = {
  sm: "start-2.5",
  md: "start-3",
  lg: "start-3.5",
};

/**
 * LynkFlow's standard text input -- the canonical text field for every
 * microfrontend. A password show/hide toggle is left for a future
 * `PasswordInput` rather than folded into this component's props.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      isRequired = false,
      error,
      helperText,
      size = "md",
      className,
      id,
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasError = Boolean(error);
    const message = error ?? helperText;
    const state = hasError ? "error" : "default";

    const describedBy =
      [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            // Always " " -- makes :placeholder-shown act as an is-empty check.
            placeholder=" "
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              inputBaseClassName,
              inputSizeClassName[size],
              inputStateClassName[state],
              // Last, so a caller's utility can override same-group defaults (utils/cn.ts).
              className,
            )}
            {...rest}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute font-sans text-neutral-400 transition-all",
                labelStartClassName[size],
                labelClassName[size],
              )}
            >
              {label}
              {isRequired && (
                // The leading {" "} is a real space text node -- JSX collapses
                // whitespace across the line break, so without it the label's
                // text content is "Email*" (no space) even though the ms-0.5
                // margin makes it look spaced. Breaks getByLabelText queries otherwise.
                <>
                  {" "}
                  <span className="ms-0.5 text-danger" aria-hidden="true">
                    *
                  </span>
                </>
              )}
            </label>
          )}
        </div>
        {message && (
          // Keyed by message text so the entrance animation replays when the
          // visible text actually changes, not on every re-render with the same text.
          <p
            key={message}
            id={messageId}
            className={cn(
              "mt-1.5 text-sm transition-colors motion-safe:animate-[fadeSlideIn_200ms_ease-out]",
              hasError ? "text-danger" : "text-neutral-500",
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
