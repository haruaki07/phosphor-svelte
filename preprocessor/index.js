import MagicString from "magic-string"

/**
 * @returns {import(".").PreprocessorGroup}
 */
export function phosphorSvelteOptimize() {
  return {
    name: "phosphor-svelte-optimize",
    script({ attributes, filename, content }) {
      if (!filename || /node_modules/.test(filename)) return

      const re = new RegExp(
        /import\s*{(?<imports>[^}]*)}\s*from\s*["']phosphor-svelte["']([\s\n]*;)?/g
      )

      let output = new MagicString(content, { filename })
      for (let match of content.matchAll(re)) {
        const modules = match.groups["imports"]
          .trim()
          .replace(/,$/, "")
          .split(",")
          .map((s) => s.trim())
        const icons = modules.filter((s) => !s.startsWith("type"))
        const types = modules.filter((s) => s.startsWith("type"))

        const newImports = icons.map((icon) => {
          let matches
          if ((matches = icon.match(/(\w+)\s+as\s+(\w+)/))) {
            const module = matches[1]
            const alias = matches[2]

            return `import ${alias} from "phosphor-svelte/lib/${module}";`
          }

          return `import ${icon} from "phosphor-svelte/lib/${icon}";`
        })

        if (types.length > 0) {
          const typeImports = types.map((t) => t.slice(5, t.length)).join(", ")
          newImports.push(
            `import type { ${typeImports} } from "phosphor-svelte";`
          )
        }

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
