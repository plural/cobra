<script lang="ts">
  import GlobalMessages from "../widgets/GlobalMessages.svelte";

  let { tournamentId }: { tournamentId: number } = $props();
</script>

<GlobalMessages />

<div class="d-flex align-items-center m-2">
  <div class="spinner-border m-auto"></div>
</div>
