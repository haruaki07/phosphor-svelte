const { generateIconName } = require("./utils");

function componentTemplate(types) {
  let componentString = `<!-- GENERATED FILE -->
<script>
  import { getContext } from "svelte";

  const ctx = getContext("iconCtx") || {};

  export let weight = ctx.weight ?? "regular";
  export let color = ctx.color ?? "currentColor";
  export let size = ctx.size ?? "1em";
  export let mirrored = ctx.mirrored || false;
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width={size}
  height={size}
  fill={color}
  transform={mirrored ? "scale(-1, 1)" : undefined} 
  viewBox="0 0 256 256">
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

function definitionsTemplate(icons) {
  return `import { SvelteComponent } from "./shared";

declare type Weight =
  | "bold"
  | "duotone"
  | "fill"
  | "light"
  | "thin"
  | "regular";

export interface IconProps {
  /** @type {string} [color="currentColor"] */
  color?: string;
  /** @type {number|string} [size="1em"] */
  size?: number | string;
  /** @type {string} [id="regular"] */
  weight?: Weight;
  /** @type {boolean} [mirrored=false] */
  mirrored?: boolean;
}

type IconContextValue = Required<
  Pick<IconProps, "color" | "size" | "weight" | "mirrored">
>;

export interface IconContextProps {
  values: IconContextValue;
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

module.exports = {
  componentTemplate,
  definitionsTemplate,
};
