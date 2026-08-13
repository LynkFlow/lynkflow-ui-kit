import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "../../utils/index.js";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "placeholder"
> {
  /**
   * Floating label rendered INSIDE the field -- centered like a placeholder
   * while the field is empty and unfocused, floating to a small label at
   * the top the moment the field is focused or has a value. This is the
   * label; there's no separate `placeholder` prop (see below).
   */
  label?: string;
  /**
   * Marks the field as mandatory and appends the platform's standard "*"
   * indicator next to the label (business-domain.md's mandatory-field rule).
   * This is visual only -- the actual required-field check happens wherever
   * the form is submitted, same as any other client-side validation.
   */
  isRequired?: boolean;
  /**
   * Validation message. When set, the field renders in its error state
   * (danger border, `aria-invalid`) and this message replaces `helperText`
   * -- business-domain.md requires a validation message to identify the
   * offending field, which this does by rendering right below that field
   * rather than in a single form-level banner.
   */
  error?: string;
  /** Hint text rendered below the field when there is no `error`. */
  helperText?: string;
  /** Size of the field. Defaults to "md". */
  size?: InputSize;
}

// Floating-label mechanism, pure CSS (Tailwind `peer` + the native
// `:placeholder-shown` pseudo-class) -- no extra React state, works for
// both controlled and uncontrolled inputs. `:placeholder-shown` only
// matches while the field's value is empty AND it has a non-empty
// `placeholder` attribute, which is why the underlying <input> always gets
// `placeholder=" "` (a single space) below and why this component doesn't
// expose a real `placeholder` prop -- the floating label already fills
// that role, and a second, competing placeholder wouldn't make sense next
// to it visually.
//
// The label floats to its small, top-of-field position when EITHER the
// field is focused (`peer-focus:`) OR it already has a value
// (`peer-[:not(:placeholder-shown)]:`) -- matching the real Figma states:
// focused-but-empty floats the label too, not just "has content".
//
// Sizing (13 Aug 2026, given directly by the developer from Figma's dev-mode
// inspector, `md`): height 52px, padding 12px, border-width 1px, gap 4px.
// The developer's earlier complaint was that the field felt "big" and "not
// very controllable" -- the previous version derived its total height from
// an implicit sum of padding + line-height, which made the actual rendered
// height hard to reason about at a glance. This version fixes that two ways:
// 1. Height is an EXPLICIT Tailwind step (`h-13` = 52px for md, not derived),
//    so the box is always exactly that tall regardless of font metrics.
// 2. `pt`/`pb` are static -- they never change between the resting and
//    floated states (same as the original design). Only the <label>
//    sibling moves; the input's own text always renders at the same
//    fixed position, `pt` below the top edge. This is what makes "gap:
//    4px" concrete: `pt` is sized so that exactly 4px separates the
//    floated label's bottom edge from the input text's top edge --
//    see the label's own `top-*`/`leading-none` comment below for the
//    worked numbers.
// Value text stays at its full, normal size in every state (no shrinking on
// float) -- only the label itself shrinks, which is what keeps the field
// legible. `sm`/`lg` are scaled from `md` in 8px height steps (44px/60px),
// keeping the same "static pt/pb, fixed height" mechanism throughout.
const inputSizeClassName: Record<InputSize, string> = {
  sm: "h-11 px-2.5 pt-4 pb-1.5 text-sm",
  md: "h-13 px-3 pt-5 pb-1.5 text-base",
  lg: "h-15 px-3.5 pt-6 pb-1.5 text-lg",
};

// Measured: given directly by the developer --
// border: #E4E8ED unfocused / #128C58 focused (-> neutral-200 / primary-400,
// both real ramp steps, see tokens/index.ts). Danger has no ramp (a single
// flat value), so its focus/hover states reuse the same flat `border-danger`
// rather than inventing a step that doesn't exist -- same rule as the
// original error-state border.
const inputStateClassName = {
  default: "border-neutral-200 hover:border-neutral-300 focus:border-primary-400",
  error: "border-danger hover:border-danger focus:border-danger",
};

// Deliberately NO focus ring/ring-offset here, unlike styling.md's general
// focus-visible pattern for other interactive elements -- Figma's real spec
// for this field is exactly `border: 1px solid #128C58` on focus, nothing
// else. Adding the platform's usual `ring-2 ring-offset-2` on top of that
// border produced a visible double-border/halo that doesn't exist in the
// design (this is what got corrected here). The border-color swap itself
// (neutral-200 -> primary-400, a strong, unambiguous contrast change) is
// the field's focus indicator; don't add a ring back in without checking
// the real design first.
// `rounded-sm` = `radius.sm` (4px, tokens/index.ts) -- kept as-is against
// the 13 Aug 2026 sizing fix. The developer's Figma spec named the corner
// radius via a variable reference ("Input Field/cornerRadius") rather than
// a literal pixel value, and this token is already what the field used
// before, so it's left unchanged here rather than guessed at. If that
// variable resolves to something other than 4px, update `radius.sm` (or
// point this at a different token) rather than hardcoding a one-off value.
const inputBaseClassName =
  "peer w-full rounded-sm border bg-white font-sans text-neutral-900 placeholder-transparent transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 disabled:hover:border-neutral-200";

// Label's resting (placeholder-sized, vertically centered) vs. floated
// (small, pinned near the top) position/size per input size. Written as
// full literal utility strings, not composed at runtime -- Tailwind's
// build-time scanner needs the exact class names present in source.
//
// Floated `top-*` + `leading-none` are solved, not guessed, against each
// size's own static `pt` above (`inputSizeClassName`) so the label's bottom
// edge sits exactly 4px above the input text's top edge -- e.g. for `md`:
// `pt-5` = 20px reserved above the text; a `text-xs` (12px) label with
// `leading-none` (so its rendered line height equals its font size, not
// Tailwind's wider default) positioned at `top-1` (4px) spans 4px-16px,
// leaving exactly 16px-20px = 4px of clear space before the text starts.
// `leading-none` is required on every floated label -- without it the
// label's line-height overflows past its own text and eats into that 4px
// gap. `sm`/`lg` follow the identical formula against their own `pt`.
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
 * LynkFlow's standard text input.
 *
 * This is the canonical text field for every LynkFlow microfrontend. Do not
 * create a local input component in an MFE -- import this one from
 * `@lynkflow/ui-kit` instead.
 *
 * The label floats INSIDE the field (per the real Figma design), not above
 * it -- see the floating-label comment above for how, and why there's no
 * separate `placeholder` prop. A password show/hide toggle, also visible in
 * the source screens, is intentionally left for a follow-up `PasswordInput`
 * rather than folded into this component's props.
 *
 * Consuming apps must import the compiled stylesheet once (typically in the
 * Shell): `import "@lynkflow/ui-kit/styles.css";`
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
            // Intentionally always " " -- see the floating-label comment
            // above. This is what makes `:placeholder-shown` behave as an
            // "is this field empty" check.
            placeholder=" "
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              inputBaseClassName,
              inputSizeClassName[size],
              inputStateClassName[state],
              // Last, so a caller's utility beats the default/error state's
              // in the same conflict group while base layout/focus/disabled
              // classes survive. See utils/cn.ts.
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
                // The leading `{" "}` is a real space text node, not just
                // the `ms-0.5` margin below -- JSX collapses the whitespace
                // between `{label}` and this expression across the line
                // break, so without it the label's actual text content is
                // "Email*" (no space) even though the margin makes it LOOK
                // spaced. That silently broke every getByLabelText("Email
                // *")-style query (FormInput.test.tsx caught this the first
                // time the real Jest suite ran successfully end-to-end on a
                // machine, not in this sandbox -- see tooling.md/testing.md's
                // repeated "verify on a real machine" notes). Keeping the
                // margin too, not removing it -- it's what gives the exact
                // visual gap; the space is for text content/accessibility
                // parity, not visual spacing.
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
          // Keyed by the message's own text, not just its presence: this
          // makes the entrance animation replay whenever the VISIBLE text
          // actually changes (helper text -> error, or one error swapped
          // for another) by forcing a fresh mount, while typing that
          // produces the *same* message on every keystroke (the common
          // case while a field stays invalid) doesn't replay it on every
          // render. A CSS transition alone can't do this -- it only
          // animates a property change on an already-mounted element, and
          // this element is conditionally mounted in the first place. See
          // styles.css's fadeSlideIn keyframe.
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
