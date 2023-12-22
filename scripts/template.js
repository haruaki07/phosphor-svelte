/**
 *
 * @param {{ weight: string, svgPath: string }[]} iconWeights
 * @returns
 */
export function componentTemplate(iconWeights) {
  let componentString = `<!-- GENERATED FILE -->
<script>
  import { getContext } from "svelte";

  const {
    weight: ctxWeight,
    color: ctxColor,
    size: ctxSize,
    mirrored: ctxMirrored,
    ...restCtx
  } = getContext("iconCtx") || {};

  export let weight = ctxWeight ?? "regular";
  export let color = ctxColor ?? "currentColor";
  export let size = ctxSize ?? "1em";
  export let mirrored = ctxMirrored || false;
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width={size}
  height={size}
  fill={color}
  transform={mirrored ? "scale(-1, 1)" : undefined} 
  viewBox="0 0 256 256"
  {...restCtx}
  {...$$restProps}>
  <slot/>
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

/**
 *
 * @param {{
 *   name: string,
 *   iconName: string,
 *   weights: {
 *     svgPath: string,
 *     weight: string
 *   }[]
 * }[]} components
 * @returns
 */
export function definitionsTemplate(components) {
  return `import { SvelteComponent, IconProps } from "./shared.js";

export interface IconContextProps {
  values: IconProps;
}

export declare class IconContext extends SvelteComponent<IconContextProps> {}

${components
  .map(
    (cmp) =>
      `export declare class ${cmp.name} extends SvelteComponent<IconProps> {}`
  )
  .join("\n")}`;
}
