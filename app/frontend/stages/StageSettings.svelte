<script lang="ts">
  import { onMount } from "svelte";
  import {
    StageData,
    ValidationError,
    loadStage,
    saveStage,
  } from "./StageSettings";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import TableRangeEdit from "./TableRangeEdit.svelte";

  interface Props {
    tournamentId: number;
    stageId: number;
  }

  let { tournamentId, stageId }: Props = $props();

  let data: StageData = $state(new StageData());
  let dataBackup: StageData;
  let isSubmitting = $state(false);
  let error = $state("");
  let newTableRangeEdit: TableRangeEdit | null = $state(null);

  onMount(async () => {
    data = await loadStage(tournamentId, stageId);
    dataBackup = structuredClone($state.snapshot(data));
  });

  async function submitStage(e: SubmitEvent) {
    e.preventDefault();
    isSubmitting = true;

    // Automatically add the new table range in case they forgot to click the add button
    if (newTableRangeEdit)
    {
      newTableRangeEdit.addRange();
    }

    try {
      const response = await saveStage(
        data.csrf_token,
        tournamentId,
        data.stage,
      );
      window.location.href = response.url;
    } catch (err) {
      error =
        err instanceof ValidationError
          ? err.errors
          : "An unexpected error occurred. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function undoChanges() {
    data = dataBackup;
    newTableRangeEdit?.reset();
  }
</script>

<p>
  <a href="/tournaments/{tournamentId}/rounds" class="btn btn-primary">
    <FontAwesomeIcon icon="arrow-left" /> Back to Pairings
  </a>
</p>

{#if data}
  {#if data.warning}
    <div class="alert alert-warning">{data.warning}</div>
  {/if}

  <div class="row">
    <div class="col-12">
      <h2>{data.stage.format}</h2>

      <form onsubmit={submitStage}>
        <fieldset disabled={isSubmitting}>
          <h3>Custom Table Ranges</h3>
          {#if error}
            <div class="alert alert-danger">{error}</div>
          {/if}
          {#each data.stage.table_ranges as tableRange (tableRange.id)}
            <TableRangeEdit stage={data.stage} {tableRange} />
          {/each}
          <TableRangeEdit bind:this={newTableRangeEdit} stage={data.stage} />
        </fieldset>

        <div class="col sm-1 mt-2">
          <button
            type="submit"
            class="btn btn-success mr-2"
            aria-label="Save stage"
          >
            {#if isSubmitting}
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            {:else}
              <FontAwesomeIcon icon="floppy-o" />
              Save
            {/if}
          </button>
          <button type="button" onclick={undoChanges} class="btn btn-info">
            <FontAwesomeIcon icon="undo" /> Undo
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
