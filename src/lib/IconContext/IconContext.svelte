<script>
  import { setContext } from "svelte";

  export let values = {};

  setContext("iconCtx", values);
</script>

<slot />
