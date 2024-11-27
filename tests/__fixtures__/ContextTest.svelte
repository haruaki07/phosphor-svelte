<script>
  import Circle from "../../lib/Circle.svelte";
  import IconContext from "../../lib/IconContext.svelte";

  let { values } = $props();
</script>

<IconContext {values}>
  <Circle />
</IconContext>
