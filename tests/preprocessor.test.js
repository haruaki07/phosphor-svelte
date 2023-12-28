import { describe, expect, it } from "vitest"
import { phosphorSvelteOptimize } from "../preprocessor"
import { preprocess } from "svelte/compiler"

describe("preprocessor", () => {
  describe("phosphorSvelteOptimize", () => {
    it("should have a name", () => {
      const processor = phosphorSvelteOptimize()

      expect(processor).toHaveProperty("name", "phosphor-svelte-optimize")
    })

    it("should preprocess icon imports", async () => {
      const processor = phosphorSvelteOptimize()

      const content = `<script>
  import Airplane from "phosphor-svelte/lib/Airplane";
  import { Cube, Rectangle, Horse } from "phosphor-svelte";
</script>\n`

      const result = await preprocess(content, processor, {
        filename: "App.svelte",
      })
      expect(result).toMatchSnapshot()
    })

    it("should preprocess multiple imports", async () => {
      const processor = phosphorSvelteOptimize()

      const content = `<script>
  import { Airplane, Gear } from "phosphor-svelte";
  import { Cube, Rectangle, Horse } from "phosphor-svelte";
  import { X } from "phosphor-svelte";
</script>\n`

      const result = await preprocess(content, processor, {
        filename: "App.svelte",
      })
      expect(result).toMatchSnapshot()
    })

    it("should separate type imports", async () => {
      const processor = phosphorSvelteOptimize()

      const content = `<script lang="ts">
  import { Airplane, Gear, type IconContextProps } from "phosphor-svelte";
</script>\n`

      const result = await preprocess(content, processor, {
        filename: "App.svelte",
      })
      expect(result).toMatchSnapshot()
    })

    it("should preprocess aliased imports", () => {
      const processor = phosphorSvelteOptimize()

      const content = `<script>
  import { Airplane, Gear as IconGear } from "phosphor-svelte";
</script>\n`
      const output = `<script>
  import Airplane from "phosphor-svelte/lib/Airplane";
import IconGear from "phosphor-svelte/lib/Gear";
</script>\n`

      const result = processor.script({ content, filename: "App.svelte" })

      expect(result.code).toBe(output)
    })
  })
})
