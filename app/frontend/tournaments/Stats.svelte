<script lang="ts">
  import { onMount } from "svelte";
  import { loadPairings, loadStats, PairingsData, type Stats } from "../pairings/PairingsData";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";

  let { tournamentId }: { tournamentId: number; } = $props();

  let data: PairingsData | undefined = $state();
  let stats: Stats | undefined = $state();

  onMount(async () => {
    data = await loadPairings(tournamentId);
    stats = await loadStats(tournamentId);
  });
</script>

<GlobalMessages />

<h2>Stats</h2>

{#if data}
  <div>
    {#if data.stages.some((s) => s.rounds.length > 0)}
      <h3>Swiss Rounds</h3>

      <!-- Swiss stage faction pie charts -->
      <div class="row">
        <div class="col-md-6">
          <table class="table">
            <thead>
              <tr>
                <th>Corp Factions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div id="corp_faction_chart"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-6">
          <table class="table">
            <thead>
              <tr>
                <th>Runner Factions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div id="runner_faction_chart"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Swiss stage faction tables -->
      <div class="row mt-3 dontprint">
        <div class="col-md-6">
          <table id="swiss_corp_table" class="table">
            <thead>
              <tr>
                <th>Corp</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="col-md-6">
          <table id="swiss_runner_table" class="table">
            <thead>
              <tr>
                <th>Runner</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      {#if data.stages.length > 1}
        <h3>Elimination Rounds</h3>

        <!-- Elimination stage faction pie charts -->
        <div class="row">
          <div class="col-md-6">
            <table class="table">
              <thead>
                <tr>
                  <th>Corp Factions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div id="cut_corp_faction_chart"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6">
            <table class="table">
              <thead>
                <tr>
                  <th>Runner Factions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div id="cut_runner_faction_chart"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Elimination stage faction tables -->
        <div class="row mt-3 dontprint">
          <div class="col-md-6">
            <table id="cut_corp_table" class="table">
              <thead>
                <tr>
                  <th>Corp</th>
                  <th>Players</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="col-md-6">
            <table id="cut_runner_table" class="table">
              <thead>
                <tr>
                  <th>Runner</th>
                  <th>Players</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      {/if}

      {#if data.stages.at(-1)?.is_elimination}
        <!-- TODO -->
      {:else}
        <h3>No elimination stage</h3>
        <p>If an elimination stage is played, cut conversion rate info will be available here.</p>
      {/if}
    {:else}
      <h3>No stats available</h3>
      <p>This tournament has no rounds yet. Stats will be available once the tournament has started and rounds have been played.</p>
    {/if}
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}