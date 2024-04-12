import { componentTemplate, definitionsTemplate } from "../scripts/template.js";
import { describe, it, expect } from "vitest";

describe("componentTemplate", () => {
  it("should generate component", () => {
    const icon = [
      {
        weight: "regular",
        svgPath: `<path d="M216,136H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"/>`,
      },
      {
        weight: "thin",
        svgPath: `<path d="M216,132H40a4,4,0,0,1,0-8H216a4,4,0,0,1,0,8Z"/>`,
      },
    ];

    const result = componentTemplate(icon);
    expect(result).toEqual(`<!-- GENERATED FILE -->
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
  {#if weight === "regular"}
    <path d="M216,136H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"/>
  {:else if weight === "thin"}
    <path d="M216,132H40a4,4,0,0,1,0-8H216a4,4,0,0,1,0,8Z"/>
  {:else}
    {(console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), "")}
  {/if}
</svg>`);
  });
});

describe("definitionsTemplate", () => {
  it("should generate ts definition", () => {
    const components = [{ name: "Minus" }, { name: "Plus" }];

    const result = definitionsTemplate(components);
    expect(result)
      .toEqual(`import type { SvelteComponent, IconProps } from "./shared.d.ts";

export interface IconContextProps {
  values: IconProps;
}

export declare class IconContext extends SvelteComponent<IconContextProps> {}

export declare class Minus extends SvelteComponent<IconProps> {}
export declare class Plus extends SvelteComponent<IconProps> {}`);
  });
});
