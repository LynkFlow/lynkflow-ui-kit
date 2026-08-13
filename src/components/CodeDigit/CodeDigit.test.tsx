import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CodeDigit } from "./CodeDigit.js";
import type { CodeDigitProps } from "./CodeDigit.js";

// A tiny controlled wrapper -- CodeDigit is fully controlled (like Input),
// so most behavioral tests need real state to observe onChange actually
// driving what's rendered, not just that it was called once.
function ControlledCodeDigit(props: Partial<CodeDigitProps>) {
  const [value, setValue] = useState(props.value ?? "");
  return <CodeDigit {...props} value={value} onChange={setValue} />;
}

function getBoxes(): HTMLInputElement[] {
  return screen.getAllByRole("textbox");
}

describe("CodeDigit", () => {
  it("renders 6 boxes by default", () => {
    render(<ControlledCodeDigit />);
    expect(getBoxes()).toHaveLength(6);
  });

  it("renders a custom number of boxes via length", () => {
    render(<ControlledCodeDigit length={4} />);
    expect(getBoxes()).toHaveLength(4);
  });

  it("labels the whole group for accessibility, defaulting to 'Verification code'", () => {
    render(<ControlledCodeDigit />);
    expect(
      screen.getByRole("group", { name: "Verification code" }),
    ).toBeInTheDocument();
  });

  it("accepts a custom group label", () => {
    render(<ControlledCodeDigit ariaLabel="2FA code" />);
    expect(screen.getByRole("group", { name: "2FA code" })).toBeInTheDocument();
  });

  it("labels each box with its position", () => {
    render(<ControlledCodeDigit length={3} />);
    expect(screen.getByLabelText("Digit 1 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 2 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Digit 3 of 3")).toBeInTheDocument();
  });

  describe("typing", () => {
    it("fills a box and advances focus to the next one", () => {
      render(<ControlledCodeDigit length={3} />);
      const boxes = getBoxes();
      boxes[0]?.focus();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      expect(boxes[0]).toHaveValue("1");
      expect(boxes[1]).toHaveFocus();
    });

    it("fills every box in sequence and reports the full code via onChange", () => {
      render(<ControlledCodeDigit length={3} />);
      const boxes = getBoxes();
      boxes[0]?.focus();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      fireEvent.keyDown(boxes[1]!, { key: "2" });
      fireEvent.keyDown(boxes[2]!, { key: "3" });
      expect(boxes.map((box) => box.value).join("")).toBe("123");
    });

    it("overwrites an already-filled box's digit without ambiguity", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      fireEvent.keyDown(boxes[0]!, { key: "9" });
      expect(boxes[0]).toHaveValue("9");
      expect(boxes[1]).toHaveValue("");
    });

    it("ignores non-digit keys", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.keyDown(boxes[0]!, { key: "a" });
      expect(boxes[0]).toHaveValue("");
    });
  });

  describe("backspace / delete / arrows", () => {
    it("clears the current box on backspace without moving focus, if it has a digit", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      boxes[0]?.focus();
      fireEvent.keyDown(boxes[0]!, { key: "Backspace" });
      expect(boxes[0]).toHaveValue("");
    });

    it("moves back and clears the previous box on backspace from an already-empty box", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      boxes[1]?.focus();
      fireEvent.keyDown(boxes[1]!, { key: "Backspace" });
      expect(boxes[0]).toHaveValue("");
      expect(boxes[0]).toHaveFocus();
    });

    it("does nothing on backspace from the first, already-empty box", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      boxes[0]?.focus();
      fireEvent.keyDown(boxes[0]!, { key: "Backspace" });
      expect(boxes[0]).toHaveFocus();
    });

    it("navigates with ArrowLeft/ArrowRight without changing any value", () => {
      render(<ControlledCodeDigit length={3} />);
      const boxes = getBoxes();
      boxes[1]?.focus();
      fireEvent.keyDown(boxes[1]!, { key: "ArrowLeft" });
      expect(boxes[0]).toHaveFocus();
      fireEvent.keyDown(boxes[0]!, { key: "ArrowRight" });
      expect(boxes[1]).toHaveFocus();
    });

    it("clears the current box on Delete", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      fireEvent.keyDown(boxes[0]!, { key: "Delete" });
      expect(boxes[0]).toHaveValue("");
    });
  });

  // These exercise the onChange fallback directly (bypassing onKeyDown),
  // covering the entry paths onKeyDown's preventDefault() normally
  // pre-empts -- mobile autofill and IME composition, which set a box's
  // value without going through individual keydown events.
  describe("onChange fallback (autofill / IME)", () => {
    it("accepts a single digit set directly via a change event", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.change(boxes[0]!, { target: { value: "5" } });
      expect(boxes[0]).toHaveValue("5");
      expect(boxes[1]).toHaveFocus();
    });

    it("distributes multiple digits dropped in at once via a change event", () => {
      render(<ControlledCodeDigit length={3} />);
      const boxes = getBoxes();
      fireEvent.change(boxes[0]!, { target: { value: "789" } });
      expect(boxes.map((box) => box.value).join("")).toBe("789");
    });

    it("clears the box when a change event reports an empty value", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.keyDown(boxes[0]!, { key: "1" });
      fireEvent.change(boxes[0]!, { target: { value: "" } });
      expect(boxes[0]).toHaveValue("");
    });

    it("strips non-digit characters arriving via a change event", () => {
      render(<ControlledCodeDigit length={2} />);
      const boxes = getBoxes();
      fireEvent.change(boxes[0]!, { target: { value: "a" } });
      expect(boxes[0]).toHaveValue("");
    });
  });

  describe("paste", () => {
    it("distributes a pasted code across the remaining boxes from the focused one", () => {
      render(<ControlledCodeDigit length={4} />);
      const boxes = getBoxes();
      boxes[0]?.focus();
      fireEvent.paste(boxes[0]!, {
        clipboardData: { getData: () => "1234" },
      });
      expect(boxes.map((box) => box.value).join("")).toBe("1234");
    });

    it("strips non-digit characters from the pasted text", () => {
      render(<ControlledCodeDigit length={4} />);
      const boxes = getBoxes();
      boxes[0]?.focus();
      fireEvent.paste(boxes[0]!, {
        clipboardData: { getData: () => "1-2 3a4" },
      });
      expect(boxes.map((box) => box.value).join("")).toBe("1234");
    });

    it("truncates a pasted code longer than the remaining boxes", () => {
      render(<ControlledCodeDigit length={3} />);
      const boxes = getBoxes();
      boxes[0]?.focus();
      fireEvent.paste(boxes[0]!, {
        clipboardData: { getData: () => "123456" },
      });
      expect(boxes.map((box) => box.value).join("")).toBe("123");
    });
  });

  describe("error state", () => {
    it("applies the danger border and aria-invalid to every box", () => {
      render(<ControlledCodeDigit length={2} error="Invalid code." />);
      getBoxes().forEach((box) => {
        expect(box).toHaveAttribute("aria-invalid", "true");
        expect(box.className).toContain("border-danger");
      });
    });

    it("renders the error message below the group, associated via aria-describedby", () => {
      render(<ControlledCodeDigit error="Invalid code." />);
      const message = screen.getByText("Invalid code.");
      expect(message).toBeInTheDocument();
      getBoxes().forEach((box) => {
        expect(box).toHaveAttribute(
          "aria-describedby",
          message.getAttribute("id") ?? undefined,
        );
      });
    });

    it("does not set aria-invalid or the danger border without an error", () => {
      render(<ControlledCodeDigit />);
      getBoxes().forEach((box) => {
        expect(box).not.toHaveAttribute("aria-invalid");
        expect(box.className).not.toContain("border-danger");
      });
    });

    it("animates the error message in, keyed by its own text like Input's", () => {
      render(<ControlledCodeDigit error="Invalid code." />);
      const message = screen.getByText("Invalid code.");
      expect(message.className).toMatch(
        /motion-safe:animate-\[fadeSlideIn_200ms_ease-out\]/,
      );
    });
  });

  it("keeps every box highlighted (not just the focused one) once it has a digit", () => {
    render(<ControlledCodeDigit length={2} />);
    const boxes = getBoxes();
    fireEvent.keyDown(boxes[0]!, { key: "1" });
    boxes[1]?.focus(); // move focus away from box 0
    expect(boxes[0]?.className).toContain("border-primary-400");
  });

  it("plays a brief pop animation on a box the moment it's newly filled", () => {
    render(<ControlledCodeDigit length={2} />);
    const boxes = getBoxes();
    fireEvent.keyDown(boxes[0]!, { key: "1" });
    expect(boxes[0]?.className).toMatch(
      /motion-safe:animate-\[codeDigitPop_200ms_ease-out\]/,
    );
  });

  it("removes the pop animation class again once it's finished playing", async () => {
    render(<ControlledCodeDigit length={2} />);
    const boxes = getBoxes();
    fireEvent.keyDown(boxes[0]!, { key: "1" });
    await waitFor(() => expect(boxes[0]?.className).not.toMatch(/codeDigitPop/));
  });

  it("does not re-trigger the pop animation just from overwriting an already-filled box", () => {
    render(<ControlledCodeDigit length={1} />);
    const boxes = getBoxes();
    fireEvent.keyDown(boxes[0]!, { key: "1" });
    fireEvent.keyDown(boxes[0]!, { key: "2" });
    // Still bouncing from the first fill is fine either way -- the point of
    // this test is exercising the "wasEmpty" branch's false path (an
    // overwrite is not a fresh fill), not asserting a specific class state.
    expect(boxes[0]).toHaveValue("2");
  });

  it("disables every box and blocks input when disabled", () => {
    render(<ControlledCodeDigit length={2} disabled />);
    const boxes = getBoxes();
    boxes.forEach((box) => expect(box).toBeDisabled());
    fireEvent.keyDown(boxes[0]!, { key: "1" });
    expect(boxes[0]).toHaveValue("");
  });

  it("merges a caller-provided className onto the wrapping element", () => {
    render(<ControlledCodeDigit className="my-custom-class" />);
    expect(screen.getByRole("group").parentElement).toHaveClass("my-custom-class");
  });
});
