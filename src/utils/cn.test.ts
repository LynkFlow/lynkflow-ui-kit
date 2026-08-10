import { cn } from "./cn.js";

describe("cn", () => {
  it("keeps non-conflicting classes", () => {
    expect(cn("rounded-md", "shadow", "font-semibold")).toBe(
      "rounded-md shadow font-semibold",
    );
  });

  it("lets the last class win within a conflict group", () => {
    // The whole point: joining would keep both and let stylesheet order decide.
    expect(cn("bg-primary-500", "bg-red-500")).toBe("bg-red-500");
    expect(cn("px-4", "px-8")).toBe("px-8");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("resolves conflicts per-group, not wholesale", () => {
    // px is replaced; py is a different group and survives.
    expect(cn("px-4 py-2.5", "px-8")).toBe("py-2.5 px-8");
  });

  it("ignores falsy values", () => {
    expect(cn("base", undefined, null, false, "")).toBe("base");
  });

  it("supports conditional and object forms via clsx", () => {
    // Values come from variables, not literals -- a real call site has runtime
    // state here, and literals would just be constant-folded.
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", { "opacity-50": isDisabled })).toBe(
      "base active",
    );
    expect(cn("base", isDisabled && "active", { "opacity-50": isActive })).toBe(
      "base opacity-50",
    );
  });

  it("preserves a component's boilerplate when a caller overrides colour", () => {
    // Focus/disabled/layout classes are in different conflict groups from
    // background colour, so an override must not strip them.
    const result = cn(
      "inline-flex items-center focus-visible:ring-2 disabled:opacity-60 bg-primary-500",
      "bg-neutral-900",
    );
    expect(result).toContain("inline-flex");
    expect(result).toContain("focus-visible:ring-2");
    expect(result).toContain("disabled:opacity-60");
    expect(result).toContain("bg-neutral-900");
    expect(result).not.toContain("bg-primary-500");
  });
});
