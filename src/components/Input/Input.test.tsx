import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./Input.js";

describe("Input", () => {
  it("renders a text input with an accessible, floating label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("defaults to a medium, non-error, enabled field", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input.className).toContain("h-13 px-3 pt-5 pb-1.5 text-base");
    expect(input.className).toContain("border-neutral-200");
    expect(input.className).toContain("focus:border-primary-400");
  });

  it("always sets a non-empty placeholder so :placeholder-shown works", () => {
    // The label fills the placeholder's usual role -- see Input.tsx's
    // floating-label comment for why a real `placeholder` prop isn't
    // exposed and this is always " ".
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("placeholder", " ");
  });

  it("renders the label inside the field, floating on focus or with a value", () => {
    render(<Input label="Email" />);
    const label = screen.getByText("Email");
    // Resting (placeholder-sized) state.
    expect(label.className).toContain("top-1/2");
    expect(label.className).toContain("text-neutral-400");
    // Floats up on focus -- top-1/text-xs/leading-none are solved against
    // md's own pt-5 so the label leaves exactly a 4px gap before the input
    // text (see Input.tsx's labelClassName comment for the worked numbers).
    expect(label.className).toContain("peer-focus:top-1");
    expect(label.className).toContain("peer-focus:text-xs");
    expect(label.className).toContain("peer-focus:leading-none");
    // Floats up when the field already has a value, even unfocused.
    expect(label.className).toContain("peer-[:not(:placeholder-shown)]:top-1");
  });

  it("shows the mandatory-field indicator when isRequired", () => {
    render(<Input label="Email" isRequired />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not show a mandatory-field indicator by default", () => {
    render(<Input label="Email" />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  describe("size", () => {
    it.each([
      ["sm", "h-11 px-2.5 pt-4 pb-1.5 text-sm"],
      ["md", "h-13 px-3 pt-5 pb-1.5 text-base"],
      ["lg", "h-15 px-3.5 pt-6 pb-1.5 text-lg"],
    ] as const)("applies the %s size's input classes", (size, expectedClass) => {
      render(<Input label="Email" size={size} />);
      expect(screen.getByLabelText("Email").className).toContain(expectedClass);
    });

    it.each([
      ["sm", "start-2.5"],
      ["md", "start-3"],
      ["lg", "start-3.5"],
    ] as const)(
      "aligns the %s size's label with the field's own padding",
      (size, expectedStart) => {
        render(<Input label="Email" size={size} />);
        expect(screen.getByText("Email").className).toContain(expectedStart);
      },
    );

    it.each([
      ["sm", "h-11"],
      ["md", "h-13"],
      ["lg", "h-15"],
    ] as const)(
      "gives the %s size an explicit, fixed height rather than one derived from padding/line-height",
      (size, expectedHeight) => {
        render(<Input label="Email" size={size} />);
        expect(screen.getByLabelText("Email").className).toContain(expectedHeight);
      },
    );
  });

  describe("error state", () => {
    it("renders the error message, sets aria-invalid, and applies the danger border", () => {
      render(<Input label="Email" error="Please enter a valid email." />);
      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.className).toContain("border-danger");
      expect(input.className).toContain("focus:border-danger");
      const message = screen.getByText("Please enter a valid email.");
      expect(message).toBeInTheDocument();
      expect(input).toHaveAttribute(
        "aria-describedby",
        message.getAttribute("id") ?? undefined,
      );
    });

    it("shows the error message instead of helperText when both are set", () => {
      render(
        <Input
          label="Email"
          helperText="We'll never share your email."
          error="Please enter a valid email."
        />,
      );
      expect(screen.getByText("Please enter a valid email.")).toBeInTheDocument();
      expect(
        screen.queryByText("We'll never share your email."),
      ).not.toBeInTheDocument();
    });

    it("animates the message in with a smooth fade/slide rather than snapping into place", () => {
      const { rerender } = render(<Input label="Email" />);
      expect(screen.queryByText(/valid email/)).not.toBeInTheDocument();

      rerender(<Input label="Email" error="Please enter a valid email." />);
      const message = screen.getByText("Please enter a valid email.");
      expect(message.className).toMatch(
        /motion-safe:animate-\[fadeSlideIn_200ms_ease-out\]/,
      );
      expect(message.className).toContain("transition-colors");
    });

    it("re-mounts (and so replays the entrance animation) when the message text itself changes", () => {
      const { rerender } = render(
        <Input label="Email" error="Please enter a valid email." />,
      );
      const first = screen.getByText("Please enter a valid email.");

      rerender(<Input label="Email" error="This email is already in use." />);
      const second = screen.getByText("This email is already in use.");
      // A different key -> React unmounts the old node and mounts a new
      // one, which is what makes the CSS entrance animation replay.
      expect(second).not.toBe(first);
    });
  });

  it("renders helperText when there is no error", () => {
    render(<Input label="Email" helperText="We'll never share your email." />);
    expect(screen.getByText("We'll never share your email.")).toBeInTheDocument();
  });

  it("renders no message paragraph when neither error nor helperText is set", () => {
    const { container } = render(<Input label="Email" />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("disables the input and applies disabled classes", () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeDisabled();
    expect(input.className).toContain("disabled:cursor-not-allowed");
  });

  it("accepts typed input and fires onChange", () => {
    const onChange = jest.fn();
    render(<Input label="Email" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "abc@gmail.com" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Email")).toHaveValue("abc@gmail.com");
  });

  it("renders without a label when none is given", () => {
    render(<Input aria-label="Search" />);
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });

  it("applies a hover border-darken class in the default state", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email").className).toContain(
      "hover:border-neutral-300",
    );
  });

  it("does not apply the default hover class in the error state", () => {
    render(<Input label="Email" error="Please enter a valid email." />);
    expect(screen.getByLabelText("Email").className).not.toContain(
      "hover:border-neutral-300",
    );
  });

  it("never renders a focus ring -- Figma's focus state is a border-color change only", () => {
    // Regression guard: ring-2 + ring-offset-2 stacked on top of the
    // border-color change produced a visible double border that doesn't
    // exist in the real design. See Input.tsx's comment on
    // inputBaseClassName.
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input.className).not.toMatch(/\bring-\d/);
    expect(input.className).not.toContain("ring-offset");
  });

  it("forwards a ref to the underlying <input> element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("respects an explicit id instead of the generated one", () => {
    render(<Input label="Email" id="login-email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "login-email");
  });
});

describe("Input className merging", () => {
  it("lets a caller's conflicting utility override the default state's", () => {
    render(<Input label="Email" className="border-neutral-900" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("border-neutral-900");
    expect(input).not.toHaveClass("border-neutral-200");
  });

  it("keeps base layout, focus and disabled classes when overridden", () => {
    render(<Input label="Email" className="border-neutral-900" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("w-full");
    expect(input).toHaveClass("focus:outline-none");
    expect(input).toHaveClass("disabled:cursor-not-allowed");
  });

  it("lets a caller override size padding without losing the rest", () => {
    render(<Input label="Email" size="md" className="px-10" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("px-10");
    expect(input).not.toHaveClass("px-3");
    expect(input).toHaveClass("pb-1.5");
  });

  it("lets a caller override the fixed height without losing the rest", () => {
    render(<Input label="Email" size="md" className="h-16" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("h-16");
    expect(input).not.toHaveClass("h-13");
    expect(input).toHaveClass("pt-5");
  });
});
