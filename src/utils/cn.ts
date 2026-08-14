import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names so the LAST conflicting utility wins.
 * `[a, b, className].join(" ")` leaves both classes in the attribute, and
 * which one paints depends on stylesheet order, not attribute order --
 * `tailwind-merge` knows Tailwind's conflict groups and drops the losers:
 *
 *   cn("bg-primary-500", "bg-red-500")  -> "bg-red-500"
 *   cn("px-4 py-2.5", "px-8")           -> "py-2.5 px-8"
 *
 * `clsx` runs first, so conditional forms work too:
 * `cn("base", isActive && "bg-primary-600", { "opacity-50": disabled })`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
