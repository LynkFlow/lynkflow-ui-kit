import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names so the LAST conflicting utility wins.
 *
 * Why this exists rather than `[a, b, className].join(" ")`:
 *
 * Joining leaves BOTH classes in the attribute. If a component's variant sets
 * `bg-primary-500` and a consumer passes `bg-red-500`, the rendered element
 * carries both, and which one actually paints is decided by their order in the
 * compiled stylesheet -- not by their order in the attribute. So a consumer's
 * override silently fails, and whether it fails depends on unrelated details
 * of how Tailwind happened to emit the CSS. `tailwind-merge` knows Tailwind's
 * conflict groups and drops the losers, so the result is predictable:
 *
 *   cn("bg-primary-500", "bg-red-500")     -> "bg-red-500"
 *   cn("px-4 py-2.5", "px-8")              -> "py-2.5 px-8"
 *   cn("rounded-md", undefined, "shadow")  -> "rounded-md shadow"
 *
 * Non-conflicting classes are all kept, which is what makes it safe for the
 * component's own boilerplate: layout, transitions, focus-visible rings and
 * disabled styling survive an override of colour or spacing, because nothing
 * in those groups competes.
 *
 * `clsx` runs first so conditional forms work too:
 *
 *   cn("base", isActive && "bg-primary-600", { "opacity-50": disabled })
 *
 * Exported from the package root, so MFEs composing their own domain
 * components get identical merge behaviour instead of re-deriving it:
 *
 *   import { cn } from "@lynkflow/ui-kit";
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
