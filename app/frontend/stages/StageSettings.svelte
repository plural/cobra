<script lang="ts">
  import { onMount } from "svelte";
  import {
    type Errors,
    type Stage,
    type StageData,
    type TableRange,
    ValidationError,
    loadStage,
    saveStage
  } from "./StageSettings";
  import TableRangeEdit from "./TableRangeEdit.svelte";

  interface Props {
    tournamentId: number;
    stageId: number;
  }

  let { tournamentId, stageId }: Props = $props();

  let data = $state() as StageData;
  let isSubmitting = false; // TODO: Use this
  let errors: Errors = {};

  onMount(async() => {
    data = await loadStage(tournamentId, stageId);
  });

  function cancelChanges(e: MouseEvent) {
    e.preventDefault();
    window.location.reload();
  }

  async function submitStage() {
    isSubmitting = true;
    errors = {};

    try {
      const response = await saveStage(data.csrf_token, tournamentId, data.stage);
      window.location.href = response.url;
    } catch (error) {
      errors = error instanceof ValidationError
        ? error.errors
        : { base: ["An unexpected error occurred. Please try again."] };
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if data}
  <div class="row">
    <div class="col-12">
      <h2>{data.stage.format}</h2>

      <h3>Custom Table Ranges</h3>
      <form onsubmit={submitStage}>
        {#each data.stage.table_ranges as tableRange}
          <TableRangeEdit stage={data.stage} tableRange={tableRange} />
        {/each}
        <TableRangeEdit stage={data.stage} />

        <div class="col sm-1 mt-2">
          <button type="submit" class="btn btn-success mr-2" aria-label="Save ranges">
            <span class="fa-floppy-o"></span> Save
          </button>
          <button onclick={(e) => cancelChanges(e)} type="submit" class="btn btn-info" aria-label="Cancel">
            <span class="fa-undo"></span> Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}