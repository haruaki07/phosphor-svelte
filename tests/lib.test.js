// @vitest-environment jsdom

import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import CircleIcon from "../lib/CircleIcon.svelte";
import RectangleIcon from "../lib/RectangleIcon.svelte";
import ContextTest from "./__fixtures__/ContextTest.svelte";

describe("component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render", () => {
    render(CircleIcon);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("should accept props", async () => {
    render(CircleIcon, {
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

    render(RectangleIcon, { weight: "bold" });

    const icon = screen.getByRole("img");

    expect(icon).toContainHTML(boldPath);
  });

  it("should log error for unsupported weight", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(CircleIcon, {
      weight: "aaa",
    });

    const icon = screen.getByRole("img");

    expect(icon).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it("should render slot", () => {
    render(CircleIcon, {
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

describe("icon context", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("svelte");
  });

  it("uses a stable icon context key", async () => {
    const setContext = vi.fn();

    vi.doMock("svelte", () => ({
      getContext: vi.fn(),
      hasContext: vi.fn(),
      setContext,
    }));

    const { setIconContext } = await import("../src/lib/context.js");

    const values = { color: "red" };
    setIconContext(values);

    const [[contextKey, contextValue]] = setContext.mock.calls;
    expect(typeof contextKey).toBe("symbol");
    expect(contextKey.description).toBe("phosphor-svelte");
    expect(contextValue).toBe(values);
  });

  it("returns context value when it exists", async () => {
    const getContext = vi.fn();
    const hasContext = vi.fn().mockReturnValue(true);

    vi.doMock("svelte", () => ({
      getContext,
      hasContext,
      setContext: vi.fn(),
    }));

    const { getIconContext } = await import("../src/lib/context.js");

    const values = { size: "24px" };
    getContext.mockReturnValue(values);

    expect(getIconContext()).toBe(values);

    const [[hasContextKey]] = hasContext.mock.calls;
    const [[getContextKey]] = getContext.mock.calls;
    expect(getContextKey).toBe(hasContextKey);
  });

  it("returns empty object when context does not exist", async () => {
    const hasContext = vi.fn().mockReturnValue(false);

    vi.doMock("svelte", () => ({
      getContext: vi.fn(),
      hasContext,
      setContext: vi.fn(),
    }));

    const { getIconContext } = await import("../src/lib/context.js");

    expect(getIconContext()).toEqual({});
  });
});
