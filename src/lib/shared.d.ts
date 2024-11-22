import type { Snippet } from "svelte";
import type { SVGAttributes } from "svelte/elements";

declare type IconWeight =
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
   * @type {IconWeight}
   * @default "regular"
   */
  weight?: IconWeight;
  /**
   * @type {boolean}
   * @default false
   */
  mirrored?: boolean;
}

export interface IconContextProps {
  values: IconProps;
  children?: Snippet;
}
