/**
 *
 * @param {{ weight: string, svgPath: string }[]} iconWeights
 * @returns
 */
export function componentTemplate(iconWeights) {
  let componentString = `<!-- GENERATED FILE -->
<script lang="ts">
  import type { IconComponentProps } from "./shared.d.ts";
  import { getIconContext } from "./context";

  const ctx = getIconContext();

  let { children, ...props }: IconComponentProps = $props();

  let weight = $derived(props.weight ?? ctx.weight ?? "regular");
  let color = $derived(props.color ?? ctx.color ?? "currentColor");
  let size = $derived(props.size ?? ctx.size ?? "1em");
  let mirrored = $derived(props.mirrored ?? ctx.mirrored ?? false);

  function svgAttr(obj: IconComponentProps) {
    let { weight, color, size, mirrored, ...attrs } = obj;
    return attrs;
  }
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  width={size}
  height={size}
  fill={color}
  transform={mirrored ? "scale(-1, 1)" : undefined}
  viewBox="0 0 256 256"
  {...svgAttr(ctx)}
  {...svgAttr(props)}
>
  {#if children}
    {@render children()}
  {/if}
  <rect width="256" height="256" fill="none" />
${iconWeights
  .map(({ weight, svgPath }, i) => {
    const cond =
      i === 0
        ? `{#if weight === "${weight}"}`
        : `{:else if weight === "${weight}"}`;
    return `  ${cond}\n    ${svgPath.trim()}\n`;
  })
  .join("")}  {:else}
    {(console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), "")}
  {/if}
</svg>`;

  return componentString;
}

export function definitionsTemplate(components) {
  let str = `export { default as IconContext } from "./IconContext.svelte";\n`;

  components.forEach((cmp) => {
    str += `export { default as ${cmp.name} } from "./${cmp.name}.svelte";\n`;
  });

  str += `export type * from "./shared.d.ts";\n`;

  return str;
}

export function componentDefinitionTempalte(componentName) {
  return `import type { Component } from "svelte";
import type { IconComponentProps } from "./shared.d.ts";

/**
 *
 * @example
 * \`\`\`svelte
 * <${componentName} color="white" weight="fill" size="20px" mirrored={false} />
 * \`\`\`
 *
 * ### Props
 *
 * - \`color\`: \`{string}\` - default is \`currentColor\`
 * - \`size\`: \`{number | string}\` - default is \`1em\`.
 * - \`weight\`: \`{"bold" | "duotone" | "fill" | "light" | "thin" | "regular"}\` - default is \`regular\`
 * - \`mirrored\`: \`{boolean}\` - default is \`false\`
 */
declare const ${componentName}: Component<IconComponentProps, {}, "">;
type ${componentName} = ReturnType<typeof ${componentName}>;
export default ${componentName};\n`;
}

export function moduleTemplate(components) {
  let str = "export { default as IconContext } from './IconContext.svelte';\n";

  components.forEach((cmp) => {
    str += `export { default as ${cmp.name} } from './${cmp.name}.svelte';\n`;
  });

  return str;
}
