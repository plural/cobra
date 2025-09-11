<script lang="ts">
  import { onMount } from "svelte";
  import {
    type Stage,
    type StageData,
    loadStage
   } from "./StageSettings";

  export let tournamentId: number;
  export let stageId: number;

  let data: StageData;
  let newFirstTable: number;
  let newLastTable: number;

  onMount(async() => {
    data = await loadStage(tournamentId, stageId);
  });
</script>

{#if data}
  <div class="row">
    <div class="col-12">
      <h2>{data.stage.format}</h2>

      <h3>Custom Table Ranges</h3>
      {#each data.stage.table_ranges as table_range}
        <li class="list-group-item">
          <form action="/tournament/{tournamentId}/stage/{stageId}/table_range/{table_range.id}">
            <div class="row mb-1">
              <div class="col sm-1">
                <label for="first_table">First Table</label>
                <input id="first_table" type="text" class="form-control" bind:value={table_range.first_table}>
              </div>

              <div class="col sm-1">
                <label for="last_table">Last Table</label>
                <input id="last_table" type="text" class="form-control" bind:value={table_range.last_table}>
              </div>

              <div class="col sm-1 mr-2">
                <button type="submit" value="post" class="btn btn-success" aria-label="Save">
                  <span class="fa-floppy-o"></span>
                </button>
                <button type="submit" value="delete" class="btn btn-danger" aria-label="Save">
                  <span class="fa-floppy-o"></span>
                </button>
              </div>

              <div class="col sm-9"></div>
            </div>
          </form>
        </li>
      {/each}
      <li class="list-group-item">
          <div class="row mb-1">
            <div class="col sm-1">
              <label for="first_table">First Table</label>
              <input id="first_table" type="text" class="form-control" bind:value={newFirstTable}>
            </div>

            <div class="col sm-1">
              <label for="last_table">Last Table</label>
              <input id="last_table" type="text" class="form-control" bind:value={newLastTable}>
            </div>

            <div class="col sm-1">
              <button type="submit" class="btn btn-success" aria-label="Add">
                <span class="fa-plus"></span>
              </button>
            </div>

            <div class="col sm-9"></div>
          </div>
        </li>
    </div>
  </div>
{/if}