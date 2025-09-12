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

  let { tournamentId, stageId } = $props();

  let data = $state() as StageData;
  let newFirstTable: number | undefined = $state();
  let newLastTable: number | undefined = $state();
  let isNewRangeValid = $state(false);
  let isSubmitting = false; // TODO: Use this
  let errors: Errors = {};

  onMount(async() => {
    data = await loadStage(tournamentId, stageId);
  });

  function addRange(e: MouseEvent) {
    e.preventDefault();
    data.stage.table_ranges.push({
        stage_id: stageId,
        first_table: newFirstTable || 0,
        last_table: newLastTable || 0 });
    newFirstTable = undefined;
    newLastTable = undefined;
  }

  function deleteRange(e: MouseEvent, tableRange: TableRange) {
    e.preventDefault();
    data.stage.table_ranges.splice(data.stage.table_ranges.indexOf(tableRange));
  }

  function cancelChanges(e: MouseEvent) {
    e.preventDefault();
    window.location.reload();
  }

  function newTableChanged() {
    isNewRangeValid = newFirstTable !== undefined && newLastTable != undefined
        && newFirstTable >= 0 && newLastTable >= 0 && newFirstTable <= newLastTable;
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
          <li class="list-group-item">
            <div class="row mb-1">
              <div class="col sm-1">
                <label for="first_table">First Table</label>
                <input id="first_table" type="number" class="form-control" placeholder="Enter table number" bind:value={tableRange.first_table}>
              </div>
              <div class="col sm-1">
                <label for="last_table">Last Table</label>
                <input id="last_table" type="number" class="form-control" placeholder="Enter table number" bind:value={tableRange.last_table}>
              </div>
              <div class="col sm-1">
                <button onclick={(e) => deleteRange(e, tableRange)} class="btn btn-danger" aria-label="Delete range">
                  <span class="fa-trash"></span>
                </button>
              </div>
              <div class="col sm-9"></div>
            </div>
          </li>
        {/each}
        <li class="list-group-item">
          <div class="row mb-1">
            <div class="col sm-1">
              <label for="first_table">First Table</label>
              <input id="first_table" type="number" oninput={newTableChanged} class="form-control" placeholder="Enter table number" bind:value={newFirstTable}>
            </div>
            <div class="col sm-1">
              <label for="last_table">Last Table</label>
              <input id="last_table" type="number" oninput={newTableChanged} class="form-control" placeholder="Enter table number" bind:value={newLastTable}>
            </div>
            <div class="col sm-1">
              <button onclick={(e) => addRange(e)} class="btn btn-success" aria-label="Add range" disabled={!isNewRangeValid}>
                <span class="fa-plus"></span>
              </button>
            </div>
            <div class="col sm-9"></div>
          </div>
        </li>

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