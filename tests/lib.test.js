// @vitest-environment jsdom

import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import Circle from "../lib/Circle.svelte";
import Rectangle from "../lib/Rectangle.svelte";
import ContextTest from "./__fixtures__/ContextTest.svelte";

describe("component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render", () => {
    render(Circle);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("should accept props", async () => {
    render(Circle, {
      fill: "black",
      size: "5em",
      mirrored: true,
    });

    const icon = screen.getByRole("img");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("fill", "black");
    expect(icon).toHaveAttribute("width", "5em");
    expect(icon).toHaveAttribute("height", "5em");
    expect(icon).toHaveAttribute("fill", "black");
    expect(icon).toHaveAttribute("transform", "scale(-1, 1)");
  });

  it("should render weight properly", () => {
    const boldPath = `<path d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36Zm-4,160H44V60H212Z"/>`;

    render(Rectangle, { weight: "bold" });

    const icon = screen.getByRole("img");

    expect(icon).toContainHTML(boldPath);
  });

  it("should log error for unsupported weight", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(Circle, {
      weight: "aaa",
    });

    const icon = screen.getByRole("img");

    expect(icon).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it("should render slot", () => {
    render(Circle, {
      children: createRawSnippet(() => ({
        render: () => `<title>the circle</title>`,
      })),
    });

    const icon = screen.getByRole("img");

    expect(icon).toContainHTML(`<title>the circle</title>`);
  });

  it("should accept props from context", () => {
    render(ContextTest, {
      values: { color: "red" },
    });

    let icon = screen.getByRole("img");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("fill", "red");
  });
});
