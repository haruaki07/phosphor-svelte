import { describe, it, expect } from "vitest";
import { sveltePhosphorOptimize } from "../vite/index.js";
import { parse } from "acorn";

describe("sveltePhosphorOptimize", () => {
  const plugin = sveltePhosphorOptimize();

  function transform(code, id = "src/App.svelte") {
    return plugin.transform.call(
      {
        parse(code) {
          return parse(code, {
            sourceType: "module",
            ecmaVersion: "latest",
          });
        },
      },
      code,
      id,
    );
  }

  describe("transforms phosphor-svelte imports", () => {
    it("should transform single Icon-suffixed import", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";\n`,
      );
    });

    it("should transform multiple Icon-suffixed imports", () => {
      const code = `import { CubeIcon, HeartIcon, HorseIcon } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";\n` +
          `import HeartIcon from "phosphor-svelte/lib/HeartIcon";\n` +
          `import HorseIcon from "phosphor-svelte/lib/HorseIcon";\n`,
      );
    });

    it("should transform deprecated non-suffixed imports", () => {
      const code = `import { Cube, Heart } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import Cube from "phosphor-svelte/lib/Cube";\n` +
          `import Heart from "phosphor-svelte/lib/Heart";\n`,
      );
    });

    it("should transform mixed Icon-suffixed and non-suffixed imports", () => {
      const code = `import { CubeIcon, Heart, HorseIcon } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";\n` +
          `import Heart from "phosphor-svelte/lib/Heart";\n` +
          `import HorseIcon from "phosphor-svelte/lib/HorseIcon";\n`,
      );
    });

    it("should transform IconContext import", () => {
      const code = `import { IconContext } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import IconContext from "phosphor-svelte/lib/IconContext";\n`,
      );
    });

    it("should transform IconContext mixed with icons", () => {
      const code = `import { IconContext, CubeIcon, Heart } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import IconContext from "phosphor-svelte/lib/IconContext";\n` +
          `import CubeIcon from "phosphor-svelte/lib/CubeIcon";\n` +
          `import Heart from "phosphor-svelte/lib/Heart";\n`,
      );
    });

    it("should handle aliased imports", () => {
      const code = `import { CubeIcon as MyCube, HeartIcon as MyHeart } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import MyCube from "phosphor-svelte/lib/CubeIcon";\n` +
          `import MyHeart from "phosphor-svelte/lib/HeartIcon";\n`,
      );
    });

    it("should handle aliased deprecated imports", () => {
      const code = `import { Cube as MyCube } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.code).toBe(
        `import MyCube from "phosphor-svelte/lib/Cube";\n`,
      );
    });
  });

  describe("preserves other imports", () => {
    it("should not transform imports from other packages", () => {
      const code = `import { something } from "other-package";`;
      const result = transform(code);

      expect(result.code).toBe(code);
    });

    it("should not transform default imports from phosphor-svelte/lib", () => {
      const code = `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`;
      const result = transform(code);

      expect(result.code).toBe(code);
    });

    it("should preserve multiple import statements", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";\nimport { writable } from "svelte/store";`;
      const result = transform(code);

      expect(result.code).toContain(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`,
      );
      expect(result.code).toContain(`import { writable } from "svelte/store";`);
    });

    it("should preserve code around imports", () => {
      const code = `const x = 1;\nimport { CubeIcon } from "phosphor-svelte";\nconst y = 2;`;
      const result = transform(code);

      expect(result.code).toContain(`const x = 1;`);
      expect(result.code).toContain(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`,
      );
      expect(result.code).toContain(`const y = 2;`);
    });
  });

  describe("skips excluded files", () => {
    it("should skip node_modules files", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "/project/node_modules/some-pkg/index.js");

      expect(result).toBeUndefined();
    });

    it("should skip .svelte-kit directory", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(
        code,
        "/project/.svelte-kit/generated/client.js",
      );

      expect(result).toBeUndefined();
    });

    it("should skip virtual sveltekit modules", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "virtual:__sveltekit/something");

      expect(result).toBeUndefined();
    });

    it("should skip CSS files", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;

      expect(transform(code, "test.css")).toBeUndefined();
      expect(transform(code, "test.less")).toBeUndefined();
      expect(transform(code, "test.sass")).toBeUndefined();
      expect(transform(code, "test.scss")).toBeUndefined();
      expect(transform(code, "test.styl")).toBeUndefined();
      expect(transform(code, "test.stylus")).toBeUndefined();
      expect(transform(code, "test.pcss")).toBeUndefined();
      expect(transform(code, "test.postcss")).toBeUndefined();
      expect(transform(code, "test.sss")).toBeUndefined();
    });

    it("should skip HTML files", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;

      expect(transform(code, "test.html")).toBeUndefined();
      expect(transform(code, "test.htm")).toBeUndefined();
    });

    it("should skip style query params", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "Component.svelte?type=style");

      expect(result).toBeUndefined();
    });

    it("should skip CSS files with query params", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "styles.css?used");

      expect(result).toBeUndefined();
    });
  });

  describe("processes valid file types", () => {
    it("should process .js files", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "src/utils.js");

      expect(result.code).toContain(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`,
      );
    });

    it("should process .ts files", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "src/utils.ts");

      expect(result.code).toContain(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`,
      );
    });

    it("should process .svelte files", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "src/Component.svelte");

      expect(result.code).toContain(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`,
      );
    });

    it("should process .svelte files with query params", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code, "src/Component.svelte?type=script");

      expect(result.code).toContain(
        `import CubeIcon from "phosphor-svelte/lib/CubeIcon";`,
      );
    });
  });

  describe("returns valid sourcemap", () => {
    it("should return a sourcemap", () => {
      const code = `import { CubeIcon } from "phosphor-svelte";`;
      const result = transform(code);

      expect(result.map).toBeDefined();
      expect(result.map.mappings).toBeDefined();
    });
  });

  describe("plugin metadata", () => {
    it("should have correct plugin name", () => {
      expect(plugin.name).toBe("vite-plugin-svelte-phosphor-optimize");
    });
  });
});
