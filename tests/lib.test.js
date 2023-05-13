import { render, cleanup } from "@testing-library/svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import Cube from "../lib/Cube";
import Rectangle from "../lib/Rectangle";
import IconContext from "../lib/IconContext";
import html from "svelte-htm";

describe("component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render", () => {
    const icon = render(html`
      <${Cube} data-testid="cube" />
      <svelte:component this=${Rectangle} data-testid="rectangle" />
    `);

    expect(icon.getByTestId("cube")).toBeTruthy();
    expect(icon.getByTestId("rectangle")).toBeTruthy();
  });

  it("should accept props", async () => {
    const icon = render(Cube, {
      weight: "duotone",
      size: "5em",
      color: "sky",
      mirrored: true,
      role: "img",
    });

    const node = icon.getByRole("img");
    expect(node).toBeTruthy();
    expect(node.getAttribute("width")).toEqual("5em");
    expect(node.getAttribute("height")).toEqual("5em");
    expect(node.getAttribute("fill")).toEqual("sky");
    expect(node.getAttribute("transform")).toEqual("scale(-1, 1)");
  });

  it("should render all weights", () => {
    ["bold", "duotone", "fill", "light", "thin"].forEach((weight) => {
      const icon = render(Cube, {
        weight,
        "data-testid": "cube-" + weight,
      });
      expect(icon.getByTestId("cube-" + weight)).toBeTruthy();
    });
  });

  it("should log error for unsupported weight", () => {
    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const icon = render(Cube, {
      weight: "aaa",
      "data-testid": "test",
    });

    expect(icon.getByTestId("test").innerHTML).toEqual(
      `<rect width="256" height="256" fill="none"></rect>`
    );

    expect(console.error).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledWith(
      'Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'
    );

    consoleErrorMock.mockRestore();
  });

  it("should render slot", () => {
    const icon = render(html`<${Cube} data-testid="test">
      <title>cube symbol</title>
    <//>`);

    expect(icon.getByText("cube symbol")).toBeTruthy();
  });

  it("should accept props from context", () => {
    const context = render(html`<${IconContext} values=${{ color: "salmon" }}>
      <${Cube} data-testid="cube" />
      <${Rectangle} color="sky" data-testid="rectangle" />
    <//>`);

    expect(context.getByTestId("cube").getAttribute("fill")).toEqual("salmon");
    expect(context.getByTestId("rectangle").getAttribute("fill")).toEqual(
      "sky"
    );
  });
});
