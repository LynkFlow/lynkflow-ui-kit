import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button.js";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("defaults to a primary, medium, type=button button", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toBeDisabled();
    expect(button.className).toContain("bg-primary-500");
    expect(button.className).toContain("px-4 py-2.5 text-base");
  });

  describe("variant", () => {
    it.each([
      ["primary", "bg-primary-500"],
      ["secondary", "border-primary-500"],
      ["danger", "bg-danger"],
      ["ghost", "bg-transparent"],
    ] as const)(
      "applies the %s variant's classes",
      (variant, expectedClass) => {
        render(<Button variant={variant}>Save</Button>);
        expect(screen.getByRole("button").className).toContain(expectedClass);
      },
    );
  });

  describe("size", () => {
    it.each([
      ["sm", "px-3 py-1.5 text-sm"],
      ["md", "px-4 py-2.5 text-base"],
      ["lg", "px-5 py-3 text-lg"],
    ] as const)("applies the %s size's classes", (size, expectedClass) => {
      render(<Button size={size}>Save</Button>);
      expect(screen.getByRole("button").className).toContain(expectedClass);
    });
  });

  it("merges a caller-provided className instead of overwriting it", () => {
    render(<Button className="my-custom-class">Save</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("my-custom-class");
    expect(button.className).toContain("bg-primary-500");
  });

  it("fires onClick when enabled", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables the button, sets aria-busy, and shows a spinner when isLoading, while keeping the label visible", () => {
    render(<Button isLoading>Save</Button>);
    // The accessible name must still resolve to "Save" -- loading must not
    // replace the label, only add to it, so screen readers and visual
    // users both still know what the button does.
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("does not fire onClick when isLoading", () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} isLoading>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not show a spinner when not loading", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").querySelector("svg")).toBeNull();
  });

  it("respects an explicit type override", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("forwards a ref to the underlying <button> element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
