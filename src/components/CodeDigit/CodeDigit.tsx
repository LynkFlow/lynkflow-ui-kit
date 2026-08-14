import { useEffect, useId, useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

import { cn } from "../../utils/index.js";

export interface CodeDigitProps {
  /** Number of digit boxes. Defaults to 6. */
  length?: number;
  /** The code entered so far. Fully controlled -- no internal copy of the value. */
  value: string;
  /** Fires with the new full value on type, delete, paste, or autofill. */
  onChange: (value: string) => void;
  /** Validation message. Mirrors Input's `error` prop. */
  error?: string;
  /** Accessible label for the whole group. Defaults to "Verification code". */
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const BOUNCE_DURATION_MS = 200;

function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** A row of single-digit boxes for entering a verification/OTP code. The canonical code-entry field for every microfrontend. */
export function CodeDigit({
  length = 6,
  value,
  onChange,
  error,
  ariaLabel = "Verification code",
  disabled = false,
  className,
  id,
}: CodeDigitProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const messageId = `${groupId}-message`;
  const hasError = Boolean(error);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const pendingBounceTimeouts = useRef<number[]>([]);
  const [bouncingIndices, setBouncingIndices] = useState<ReadonlySet<number>>(
    new Set(),
  );

  useEffect(
    () => () => {
      pendingBounceTimeouts.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    },
    [],
  );

  // Derived, not stored -- value is the single source of truth.
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  function focusIndex(index: number) {
    const clamped = Math.max(0, Math.min(length - 1, index));
    inputRefs.current[clamped]?.focus();
  }

  // Marks indices as "just filled" for the pop animation, then clears them.
  // Timeout tracked in a ref so it can be cancelled on unmount.
  function bounce(indices: number[]) {
    if (indices.length === 0) return;
    setBouncingIndices((previous) => new Set([...previous, ...indices]));
    const timeoutId = window.setTimeout(() => {
      setBouncingIndices((previous) => {
        const next = new Set(previous);
        indices.forEach((index) => next.delete(index));
        return next;
      });
    }, BOUNCE_DURATION_MS);
    pendingBounceTimeouts.current.push(timeoutId);
  }

  function setDigitAt(index: number, digit: string) {
    if (index < 0 || index >= length) return;
    const wasEmpty = !digits[index];
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join(""));
    if (digit && wasEmpty) bounce([index]);
  }

  // Fills boxes from startIndex with each character of pasted, in order.
  function distributeFrom(startIndex: number, pasted: string) {
    const nextDigits = [...digits];
    const filledIndices: number[] = [];
    let cursor = startIndex;
    for (const digit of pasted) {
      if (cursor >= length) break;
      if (!nextDigits[cursor]) filledIndices.push(cursor);
      nextDigits[cursor] = digit;
      cursor += 1;
    }
    onChange(nextDigits.join(""));
    bounce(filledIndices);
    focusIndex(Math.min(cursor, length - 1));
  }

  // Primary entry path -- intercepts the keystroke itself (event.key) so
  // overwriting an already-filled box is unambiguous. preventDefault() on
  // every handled key means the DOM value only ever changes via onChange.
  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      setDigitAt(index, event.key);
      focusIndex(index + 1);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        setDigitAt(index, "");
      } else if (index > 0) {
        setDigitAt(index - 1, "");
        focusIndex(index - 1);
      }
    } else if (event.key === "Delete") {
      event.preventDefault();
      setDigitAt(index, "");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    if (disabled) return;
    event.preventDefault();
    const pasted = onlyDigits(event.clipboardData.getData("text"));
    if (pasted) distributeFrom(index, pasted);
  }

  // Fallback for autofill/IME, which can set a box's value directly
  // without firing the keydown events above.
  function handleChange(index: number, raw: string) {
    if (disabled) return;
    const digitsOnly = onlyDigits(raw);
    if (!digitsOnly) {
      setDigitAt(index, "");
    } else if (digitsOnly.length === 1) {
      setDigitAt(index, digitsOnly);
      focusIndex(index + 1);
    } else {
      // Multiple digits at once -- a paste that slipped past onPaste, or autofill.
      distributeFrom(index, digitsOnly);
    }
  }

  return (
    <div className={cn("inline-flex flex-col", className)}>
      <div role="group" aria-label={ariaLabel} className="inline-flex gap-2">
        {digits.map((digit, index) => (
          <input
            // Index as key is safe here: each position IS a fixed digit
            // slot for the lifetime of this group, never reordered.
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={hasError || undefined}
            aria-describedby={error ? messageId : undefined}
            disabled={disabled}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            className={cn(
              "h-12 w-12 rounded-md border bg-white text-center font-sans text-lg font-medium text-neutral-900 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 disabled:hover:border-neutral-200",
              hasError
                ? "border-danger hover:border-danger focus:border-danger"
                : cn(
                    "hover:border-neutral-300 focus:border-primary-400",
                    // A filled box stays highlighted even once it loses
                    // focus, matching the design's progress-indicator look
                    // -- not just a focus-only border, which :focus alone
                    // already gives an empty box for free.
                    digit ? "border-primary-400" : "border-neutral-200",
                  ),
              bouncingIndices.has(index) &&
                "motion-safe:animate-[codeDigitPop_200ms_ease-out]",
            )}
          />
        ))}
      </div>
      {error && (
        // Same entrance treatment as Input's message -- see its comment
        // for why it's keyed by the message text itself.
        <p
          key={error}
          id={messageId}
          className="mt-1.5 text-sm text-danger transition-colors motion-safe:animate-[fadeSlideIn_200ms_ease-out]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

CodeDigit.displayName = "CodeDigit";
