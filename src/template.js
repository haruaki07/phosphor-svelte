const { generateIconName } = require("./utils");

function componentTemplate(types) {
  let componentString = `<!-- GENERATED FILE -->
<script>
  export let weight = "regular";
  export let color = "currentColor";
  export let size = "1em";
  export let mirrored = false;
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width={size} 
  height={size}
  fill={color} 
  transform={mirrored ? "scale(-1, 1)" : undefined} 
  viewBox="0 0 256 256">
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
  <slot/>
</svg>`;

  return componentString;
}

function definitionsTemplate(icons) {
  return `declare type Weight =
  | 'bold'
  | 'duotone'
  | 'fill'
  | 'light'
  | 'thin'
  | 'regular';

export declare class PhosphorIcon {
  $$prop_def: {
    /** @type {string} [color="currentColor"] */
    color?: string;
    /** @type {number|string} [size="1em"] */
    size?: number | string;
    /** @type {string} [id="regular"] */
    weight?: Weight;
    /** @type {boolean} [mirrored=false] */
    mirrored?: boolean;
  };
  $$slot_def: {
    /** @type {{}} [default] */
    default?: {};
  };
}

${icons
  .map(
    (icon) =>
      `export declare class ${generateIconName(
        icon.name
      )} extends PhosphorIcon {}`
  )
  .join("\n")}`;
}

module.exports = {
  componentTemplate,
  definitionsTemplate,
};
