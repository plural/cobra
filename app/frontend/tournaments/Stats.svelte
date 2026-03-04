<script lang="ts">
  import { onMount } from "svelte";
  import { loadPairings, loadStats, PairingsData, type IdCount, type Stats } from "../pairings/PairingsData";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import Identity from "../identities/Identity.svelte";

  let { tournamentId }: { tournamentId: number; } = $props();

  let data: PairingsData | undefined = $state();
  let stats: Stats | undefined = $state();

  // Sort by count in descending order, then by ID in ascending order
  function idTableComparator(id1: IdCount, id2: IdCount) {
    return id1.count !== id2.count
      ? id2.count - id1.count
      : id1.identity.name.localeCompare(id2.identity.name);
  }

  onMount(async () => {
    data = await loadPairings(tournamentId);
    stats = await loadStats(tournamentId);
  });
</script>

<GlobalMessages />

<h2>Stats</h2>

{#if data}
  {#snippet idTable(idHeader: string, ids: IdCount[], num_players: number)}
    <table class="table">
      <thead>
        <tr>
          <th>{idHeader}</th>
          <th>Players</th>
        </tr>
      </thead>
      <tbody>
        {#each ids as id (id.identity.name)}
          <tr>
            <td>
              <div>
                <Identity identity={id.identity} name_if_missing="Unspecified" icon_if_missing="interrupt" />
              </div>
            </td>
            <td>
              {id.count} ({((id.count / num_players) * 100).toFixed(1)}%)
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/snippet}

  <div>
    {#if data.stages.some((s) => s.rounds.length > 0)}
      <h3>Swiss Rounds</h3>

      {#if stats}
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
            {@render idTable("Corp", stats.swiss.corp.toSorted(idTableComparator), stats.swiss.num_players)}
          </div>
          <div class="col-md-6">
            {@render idTable("Runner", stats.swiss.runner.toSorted(idTableComparator), stats.swiss.num_players)}
          </div>
        </div>
      {:else}
        <div class="d-flex align-items-center m-2">
          <div class="spinner-border m-auto"></div>
        </div>
      {/if}

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