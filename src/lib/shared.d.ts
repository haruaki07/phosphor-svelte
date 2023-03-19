import { SvelteComponentTyped } from "svelte";

declare type Weight =
  | "bold"
  | "duotone"
  | "fill"
  | "light"
  | "thin"
  | "regular";

export interface IconProps {
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
   * @type {string}
   * @default "regular"
   */
  weight?: Weight;
  /**
   * @type {boolean}
   * @default false
   */
  mirrored?: boolean;
  /**
   * @type {string}
   * @default ""
   */
  class?: string;
}

export class SvelteComponent<Props = {}> extends SvelteComponentTyped<
  Props,
  any,
  {
    default?: {};
  }
> {}
