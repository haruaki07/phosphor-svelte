import MagicString from "magic-string"

/**
 * @returns {import(".").PreprocessorGroup}
 */
export function phosphorSvelteOptimize() {
  return {
    name: "phosphor-svelte-optimizer",
    script({ attributes, filename, content }) {
      if (!filename || /node_modules/.test(filename)) return

      const re = new RegExp(
        /import\s*{([\s\S]*?)\s*}\s*from\s*"phosphor-svelte"/g
      )

      let output = new MagicString(content, { filename })
      for (let match of content.matchAll(re)) {
        const modules = match[1]
          .trim()
          .replace(/,$/, "")
          .split(",")
          .map((s) => s.trim())
        const icons = modules.filter((s) => !s.startsWith("type"))
        const types = modules.filter((s) => s.startsWith("type"))

        const newImports = icons.map(
          (icon) => `import ${icon} from "phosphor-svelte/lib/${icon}";`
        )

        const typeImports = types.map((t) => t.slice(5, t.length)).join(", ")
        newImports.push(
          `import type { ${typeImports} } from "phosphor-svelte";`
        )

        output.update(
          match.index,
          match.index + match[0].length,
          newImports.join("\n")
        )
      }

      return {
        attributes,
        code: output.toString(),
        map: output.generateMap(),
      }
    },
  }
}
