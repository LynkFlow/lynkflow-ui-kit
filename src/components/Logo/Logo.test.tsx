import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo.js";

describe("Logo", () => {
  it("renders with an accessible name, defaulting to LynkFlow", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "LynkFlow" })).toBeInTheDocument();
  });

  it("accepts a custom accessible name", () => {
    render(<Logo ariaLabel="LynkFlow, back to home" />);
    expect(
      screen.getByRole("img", { name: "LynkFlow, back to home" }),
    ).toBeInTheDocument();
  });

  describe("variant", () => {
    it("renders both the mark and the wordmark by default (full)", () => {
      const { container } = render(<Logo />);
      expect(container.querySelectorAll("svg")).toHaveLength(2);
    });

    it("renders only the mark when variant=mark", () => {
      const { container } = render(<Logo variant="mark" />);
      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(1);
      expect(svgs[0]).toHaveAttribute("viewBox", "0 0 66 71");
    });

    it("renders only the wordmark when variant=text", () => {
      const { container } = render(<Logo variant="text" />);
      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(1);
      expect(svgs[0]).toHaveAttribute("viewBox", "0 0 320 75");
    });

    it("marks the inner SVGs as decorative (aria-hidden) regardless of variant", () => {
      const { container } = render(<Logo />);
      container.querySelectorAll("svg").forEach((svg) => {
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("gives every mark path an explicit fill=none, so the browser's default black fill doesn't paint the closed subpaths between the strokes", () => {
      // Regression guard: the mark's paths only have a `stroke`, matching
      // the brand artwork's stroke-only rendering (see the original file's
      // root fill="none"). Without an explicit fill="none" per path, SVG's
      // default fill (black) fills every closed subpath -- visible as a
      // solid black wedge in the mark's negative space that doesn't exist
      // in the real artwork.
      const { container } = render(<Logo variant="mark" />);
      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(0);
      paths.forEach((path) => {
        expect(path).toHaveAttribute("fill", "none");
      });
    });
  });

  describe("orientation (only applies to variant=full)", () => {
    it("lays out mark + text in a row by default", () => {
      render(<Logo />);
      expect(screen.getByRole("img")).toHaveClass("flex-row");
    });

    it("stacks mark above text when orientation=vertical", () => {
      render(<Logo orientation="vertical" />);
      const el = screen.getByRole("img");
      expect(el).toHaveClass("flex-col");
      expect(el).not.toHaveClass("flex-row");
    });

    it("doesn't apply a row/column class for a single-element variant", () => {
      render(<Logo variant="mark" orientation="vertical" />);
      const el = screen.getByRole("img");
      expect(el).not.toHaveClass("flex-col");
      expect(el).not.toHaveClass("flex-row");
    });
  });

  describe("size", () => {
    it.each([
      ["sm", "h-5"],
      ["md", "h-7"],
      ["lg", "h-10"],
    ] as const)("applies the %s mark height", (size, expectedClass) => {
      const { container } = render(<Logo variant="mark" size={size} />);
      expect(container.querySelector("svg")?.getAttribute("class")).toContain(
        expectedClass,
      );
    });

    describe("custom numeric size", () => {
      it("sets the mark's exact pixel height via inline style", () => {
        const { container } = render(<Logo variant="mark" size={50} />);
        expect(container.querySelector("svg")).toHaveStyle({ height: "50px" });
      });

      it("scales the wordmark height proportionally from the mark height", () => {
        const { container } = render(<Logo variant="text" size={50} />);
        // TEXT_TO_MARK_RATIO = 1.0638 -- floating point, so read the raw
        // inline style value rather than asserting an exact literal.
        const svg = container.querySelector("svg");
        expect(svg?.style.height).toMatch(/^53\.19/);
      });

      it("scales the mark/wordmark gap proportionally from the mark height", () => {
        render(<Logo size={50} />);
        // GAP_TO_MARK_RATIO = 0.3774
        expect(screen.getByRole("img")).toHaveStyle({ gap: "18.87px" });
      });

      it("does not apply a preset height class when given a custom size", () => {
        const { container } = render(<Logo variant="mark" size={50} />);
        const svg = container.querySelector("svg");
        // SVG elements expose `className` as an SVGAnimatedString, not a
        // plain string -- read the real attribute value instead.
        expect(svg?.getAttribute("class")).not.toMatch(/\bh-(5|7|10)\b/);
      });
    });
  });

  describe("color", () => {
    it("defaults the mark to the brand green token and text to the dark token", () => {
      const { container } = render(<Logo />);
      const [mark, text] = Array.from(container.querySelectorAll("svg"));
      expect(mark).toHaveStyle({ color: "#0b5d3b" });
      expect(text).toHaveStyle({ color: "#0f1115" });
    });

    it("resolves the white preset on both mark and text independently", () => {
      const { container } = render(<Logo markColor="white" textColor="white" />);
      const [mark, text] = Array.from(container.querySelectorAll("svg"));
      expect(mark).toHaveStyle({ color: "#ffffff" });
      expect(text).toHaveStyle({ color: "#ffffff" });
    });

    it("resolves 'current' to currentColor (inherits from surrounding CSS)", () => {
      // jsdom's computed-style resolution normalizes the `currentcolor`
      // keyword to the `canvastext` system-color keyword it's defined
      // against, so assert on the raw inline style value instead of
      // toHaveStyle's computed comparison.
      const { container } = render(<Logo markColor="current" />);
      const svg = container.querySelector("svg");
      expect(svg?.style.color).toBe("currentcolor");
    });

    it("accepts an arbitrary literal CSS color not in the preset list", () => {
      // jsdom's CSS parser normalizes a hex code and a named color to its
      // own canonical rgb() form -- that normalization is proof the value
      // was actually applied as a real color, not evidence of a bug.
      const { container } = render(
        <Logo markColor="#123456" textColor="rebeccapurple" />,
      );
      const [mark, text] = Array.from(container.querySelectorAll("svg"));
      expect(mark).toHaveStyle({ color: "rgb(18, 52, 86)" });
      expect(text).toHaveStyle({ color: "rgb(102, 51, 153)" });
    });
  });

  it("merges a caller-provided className onto the wrapping element", () => {
    render(<Logo className="my-custom-class" />);
    expect(screen.getByRole("img")).toHaveClass("my-custom-class");
    expect(screen.getByRole("img")).toHaveClass("inline-flex");
  });
});
