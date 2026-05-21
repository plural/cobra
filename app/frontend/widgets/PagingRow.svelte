<script lang="ts">
  export let loading = false;
  export let canGoBack = false;
  export let canGoNext = false;
  export let onBack: (() => void | Promise<void>) | undefined;
  export let onNext: (() => void | Promise<void>) | undefined;
</script>

<div class="row m-3">
  <div class="col-12 d-flex justify-content-between align-items-center">
    <button
      class="btn btn-primary"
      disabled={!canGoBack || loading}
      on:click={() => onBack?.()}
    >
      <i class="fa fa-arrow-left"></i> Back
    </button>
    <div class="text-muted">
      {#if loading}
        <i class="fa fa-spinner fa-spin"></i> Loading...
      {/if}
    </div>
    <button
      class="btn btn-primary"
      disabled={!canGoNext || loading}
      on:click={() => onNext?.()}
    >
      Next <i class="fa fa-arrow-right"></i>
    </button>
  </div>
</div>
