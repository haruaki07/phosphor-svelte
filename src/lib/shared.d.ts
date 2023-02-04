import type { SvelteComponentTyped } from "svelte";
import type { SVGAttributes } from "svelte/elements";

declare type Weight =
  | "bold"
  | "duotone"
  | "fill"
  | "light"
  | "thin"
  | "regular";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /**
   * @type {string}
   * @default "currentColor"
   */
  color?: string;
  /**
   * @type {number|string}
   * @default "1em"
   */
  size?: number | string;
  /**
   * @type {Weight}
   * @default "regular"
   */
  weight?: Weight;
  /**
   * @type {boolean}
   * @default false
   */
  mirrored?: boolean;
}

export class SvelteComponent<
  Props extends Record<string, any>
> extends SvelteComponentTyped<Props> {}
