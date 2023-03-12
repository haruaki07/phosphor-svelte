import { generateIconName } from "./utils.js";

export function componentTemplate(types) {
  let componentString = `<!-- GENERATED FILE -->
<script>
  import { getContext } from "svelte";

  const ctx = getContext("iconCtx") || {};

  export let weight = ctx.weight ?? "regular";
  export let color = ctx.color ?? "currentColor";
  export let size = ctx.size ?? "1em";
  export let mirrored = ctx.mirrored || false;

  let className = '';
  export { className as class };
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width={size}
  height={size}
  fill={color}
  class={className}
  transform={mirrored ? "scale(-1, 1)" : undefined} 
  viewBox="0 0 256 256"
  {...$$restProps}>
  <slot/>
  <rect width="256" height="256" fill="none" />
${types
  .map(({ weight, path }, i) => {
    const cond =
      i === 0
        ? `{#if weight === "${weight}"}`
        : `{:else if weight === "${weight}"}`;
    return `  ${cond}\n    ${path.trim()}\n`;
  })
  .join("")}  {:else}
    {(console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), "")}
  {/if}
</svg>`;

  return componentString;
}

export function definitionsTemplate(icons) {
  return `import { SvelteComponent, IconProps } from "./shared";

export interface IconContextProps {
  values: Required<IconProps>;
}

export declare class IconContext extends SvelteComponent<IconContextProps> {}

${icons
  .map(
    (icon) =>
      `export declare class ${generateIconName(
        icon.name
      )} extends SvelteComponent<IconProps> {}`
  )
  .join("\n")}`;
}
