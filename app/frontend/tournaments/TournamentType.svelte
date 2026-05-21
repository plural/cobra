<script lang="ts">
  export let typeId = "";
  export let userId = -1;
  export let userName = "";
</script>

<div>
  <h1>Beta Tournaments By Type</h1>
  <p>Type ID: {typeId}</p>
  {#if userId !== -1}
    <p>User: {userName} ({userId})</p>
  {/if}
</div>