import { vol } from "memfs";
import memfsExtra from "./__mocks__/fs-extra.js";
import { main as builder } from "../scripts/build.js";
import { describe, it, vi, beforeAll, expect } from "vitest";
import fs from "fs/promises";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;

function noop() {
  return void 0;
}

vi.mock("fs-extra", () => ({ default: memfsExtra }));
vi.mock("log-update", () => ({ default: noop }));
vi.mock("../scripts/utils.js", async (ori) => {
  const mod = await ori();
  return {
    ...mod,
    getCurrentDirname: () => "/tmp/scripts",
  };
});

beforeAll(async (ctx) => {
  const consoleLogMock = vi
    .spyOn(console, "log")
    .mockImplementation(() => noop);

  const [IconContextSvelte, IconContextDts, IconContextJs, SharedDts] =
    await Promise.all([
      fs.readFile(
        path.join(__dirname, "../src/lib/IconContext/IconContext.svelte"),
        "utf-8"
      ),
      fs.readFile(
        path.join(__dirname, "../src/lib/IconContext/index.d.ts"),
        "utf-8"
      ),
      fs.readFile(
        path.join(__dirname, "../src/lib/IconContext/index.js"),
        "utf-8"
      ),
      fs.readFile(path.join(__dirname, "../src/lib/shared.d.ts"), "utf-8"),
    ]);

  vol.fromNestedJSON(
    {
      "/tmp/phosphor-icons/assets": {
        regular: {
          "minus.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,136H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"/></svg>`,
          "circle.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,232A104,104,0,1,1,232,128,104.2,104.2,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.1,88.1,0,0,0,128,40Z"/></svg>`,
        },
        light: {
          "minus-light.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,136H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"/></svg>`,
          "circle-light.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,230A102,102,0,1,1,230,128,102.2,102.2,0,0,1,128,230Zm0-192a90,90,0,1,0,90,90A90.1,90.1,0,0,0,128,38Z"/></svg>`,
        },
      },
      "/tmp/src/lib": {
        IconContext: {
          "IconContext.svelte": IconContextSvelte,
          "index.d.ts": IconContextDts,
          "index.js": IconContextJs,
        },
        "shared.d.ts": SharedDts,
      },
    },
    "/tmp"
  );

  await builder();

  consoleLogMock.mockRestore();

  return () => {
    vol.reset();
    vi.restoreAllMocks();
  };
});

describe("build", () => {
  it("should copy lib dir", async () => {
    const files = await vol.promises.readdir("/tmp/lib");
    expect(files).toEqual(
      expect.arrayContaining(["IconContext", "shared.d.ts"])
    );
  });

  it("should generate component", async () => {
    const files = await vol.promises.readdir("/tmp/lib/Circle");
    expect(files).toEqual(
      expect.arrayContaining(["Circle.svelte", "index.d.ts", "index.js"])
    );
  });

  it("should build", async () => {
    const files = await vol.promises.readdir("/tmp/lib");
    expect(files).toEqual(
      expect.arrayContaining([
        "Circle",
        "IconContext",
        "Minus",
        "index.d.ts",
        "index.js",
        "shared.d.ts",
      ])
    );
  });
});
