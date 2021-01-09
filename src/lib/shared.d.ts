type LocalSvelteProps = {
  children?: any;
  class?: string;
  [key: string]: any;
};

/**
 * Local svelte class for adding typescript definitions for svelte components
 *
 */
export declare class SvelteComponent<Props = {}> {
  constructor(props: Props & LocalSvelteProps);
  $on<T = any>(
    event: string,
    callback: (event: CustomEvent<T>) => void
  ): () => void;
  $$prop_def: Props & LocalSvelteProps;
  $$slot_def: {
    default?: {};
  };
  render: undefined;
  context: undefined;
  setState: undefined;
  forceUpdate: undefined;
  props: undefined;
  state: undefined;
  refs: undefined;
}
