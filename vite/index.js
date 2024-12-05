import MagicString from "magic-string";
import { walk } from "estree-walker";

const CSS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

/**
 *
 * @returns {import("vite").Plugin}
 */
export function sveltePhosphorOptimize() {
  return {
    name: "vite-plugin-svelte-phosphor-optimize",
    transform(code, id) {
      if (
        ["/node_modules/", "/.svelte-kit/", "virtual:__sveltekit"].some((p) =>
          id.includes(p)
        )
      )
        return;
      if (CSS_RE.test(id)) return;

      const s = new MagicString(code);
      let root = this.parse(code);

      walk(root, {
        enter(node) {
          if (
            node.type === "ImportDeclaration" &&
            node.source.value === "phosphor-svelte"
          ) {
            let content = "";

            for (const specifier of node.specifiers) {
              if (specifier.type === "ImportSpecifier") {
                const fragment = `import ${specifier.local.name} from "phosphor-svelte/lib/${specifier.imported.name}";\n`;
                if (fragment) content += fragment;
              }
            }

            if (content) s.overwrite(node.start, node.end, content);
          }
        },
      });

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    },
  };
}
