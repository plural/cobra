<script lang="ts">
  import ApexCharts from "apexcharts";
  import type { ApexOptions } from "apexcharts";
  import { onMount } from "svelte";
  import { loadCutStats, loadPairings, loadStats, PairingsData, type CutFactionStats, type CutIdStats, type CutStats, type FactionStats, type IdStats, type Stats } from "../pairings/PairingsData";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import Identity from "../identities/Identity.svelte";
  import { getFaction } from "../utils/factions";
  import Faction from "../widgets/Faction.svelte";

  interface PieChartData {
    series: number[];
    labels: string[];
    colors: string[];
  }

  let { tournamentId }: { tournamentId: number; } = $props();

  let data: PairingsData | undefined = $state();
  let stats: Stats | undefined = $state();
  let cutStats: CutStats | undefined = $state();

  onMount(async () => {
    data = await loadPairings(tournamentId);
    stats = await loadStats(tournamentId);

    if (data.stages.length > 1 && data.stages.at(-1)?.is_elimination) {
      cutStats = await loadCutStats(tournamentId);
    }
  });

  $effect(() => {
    if (!stats) {
      return;
    }

    drawPieChart("swiss-corp-faction-chart", stats.swiss.corp.factions);
    drawPieChart("swiss-runner-faction-chart", stats.swiss.runner.factions);
    drawPieChart("elim-corp-faction-chart", stats.elim.corp.factions);
    drawPieChart("elim-runner-faction-chart", stats.elim.runner.factions);
  });

  // Sort by count in descending order, then by ID in ascending order
  function idTableComparator(id1: IdStats, id2: IdStats) {
    return id1.count !== id2.count
      ? id2.count - id1.count
      : id1.identity.name.localeCompare(id2.identity.name);
  }

  // Sort by cut conversion in descending order, then by number of players in ascending order
  function cutFactionTableComparator(faction1: CutFactionStats, faction2: CutFactionStats) {
      if (faction1.cutConversion !== faction2.cutConversion) {
        return faction2.cutConversion - faction1.cutConversion;
      }
      if (faction1.numCutPlayers !== faction2.numCutPlayers) {
        return faction2.numCutPlayers - faction1.numCutPlayers;
      }
      return faction1.name.localeCompare(faction2.name);
  }

  // Sort by cut conversion in descending order, then by number of players in ascending order
  function cutIdTableComparator(id1: CutIdStats, id2: CutIdStats) {
    if (id1.cutConversion !== id2.cutConversion) {
      return id2.cutConversion - id1.cutConversion;
    }
    if (id1.numCutPlayers !== id2.numCutPlayers) {
      return id2.numCutPlayers - id1.numCutPlayers;
    }
    return id1.identity.name.localeCompare(id2.identity.name);
  }

  function getPieChartData(factions: FactionStats[]) {
    const results: PieChartData = {
      series: [],
      labels: [],
      colors: [],
    };

    factions.forEach((stats) => {
      const faction = getFaction(stats.name);

      results.series.push(stats.count);
      results.labels.push(faction.displayName);
      results.colors.push(faction.color);
    });

    return results;
  }

  function drawPieChart(elementId: string, data: FactionStats[]) {
    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    const factions = getPieChartData(data);
    const options: ApexOptions = {
      chart: {
        offsetY: 20,
        animations: {
          enabled: false
        },
        selection: {
          enabled: false,
        },
        height: "300px",
        type: "pie",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          dataLabels: {
              offset: -10,
          },
        },
      },
      series: factions.series,
      labels: factions.labels,
      colors: factions.colors,
    }

    var chart = new ApexCharts(element, options);
    void chart.render();
  }
</script>

<GlobalMessages />

<h2>Stats</h2>

{#if data}
  {#snippet idTable(tableId: string, idHeader: string, ids: IdStats[], num_players: number)}
    <table id={tableId} class="table">
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
              <Identity identity={id.identity} name_if_missing="Unspecified" icon_if_missing="interrupt" />
            </td>
            <td>
              {id.count} ({((id.count / num_players) * 100).toFixed(1)}%)
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/snippet}

  {#snippet cutFactionTable(tableId: string, idHeader: string, factions: CutFactionStats[])}
    <table id={tableId} class="table">
      <thead>
        <tr>
          <th>{idHeader}</th>
          <th>Players</th>
        </tr>
      </thead>
      <tbody>
        {#each factions as faction (faction.name)}
          <tr>
            <td>
              <Faction name={faction.name} />
            </td>
            <td>
              {faction.numCutPlayers} / {faction.numSwissPlayers} ({faction.cutConversion.toFixed(1)}%)
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/snippet}

  {#snippet cutIdTable(tableId: string, idHeader: string, ids: CutIdStats[])}
    <table id={tableId} class="table">
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
              <Identity identity={id.identity} name_if_missing="Unspecified" icon_if_missing="interrupt" />
            </td>
            <td>
              {id.numCutPlayers} / {id.numSwissPlayers} ({id.cutConversion.toFixed(1)}%)
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/snippet}

  <div>
    {#if data.stages.some((s) => s.rounds.length > 0)}
      <h3>Swiss Rounds</h3>

      {#if stats?.swiss}
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
                     <div id="swiss-corp-faction-chart"></div>
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
                    <div id="swiss-runner-faction-chart"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Swiss stage ID tables -->
        <div class="row mt-3 dontprint">
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render idTable("swiss-corp-table", "Corp", stats.swiss.corp.ids.toSorted(idTableComparator), stats.swiss.num_players)}
          </div>
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render idTable("swiss-runner-table", "Runner", stats.swiss.runner.ids.toSorted(idTableComparator), stats.swiss.num_players)}
          </div>
        </div>
      {:else}
        <div class="d-flex align-items-center m-2">
          <div class="spinner-border m-auto"></div>
        </div>
      {/if}

      {#if data.stages.length > 1}
        <h3>Elimination Rounds</h3>

        {#if stats?.elim}
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
                      <div id="elim-corp-faction-chart"></div>
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
                      <div id="elim-runner-faction-chart"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Elimination stage ID tables -->
          <div class="row mt-3 dontprint">
            <div class="col-md-6">
              <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
              {@render idTable("elim-corp-table", "Corp", stats.elim.corp.ids.toSorted(idTableComparator), stats.elim.num_players)}
            </div>
            <div class="col-md-6">
              <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
              {@render idTable("elim-runner-table", "Runner", stats.elim.runner.ids.toSorted(idTableComparator), stats.elim.num_players)}
            </div>
          </div>
        {:else}
          <div class="d-flex align-items-center m-2">
            <div class="spinner-border m-auto"></div>
          </div>
        {/if}
      {/if}

      {#if cutStats}
        <h3>Elimination Cut Conversion Rates</h3>

        <!-- Cut conversion faction tables -->
        <div class="row mt-3 dontprint">
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutFactionTable("cut-corp-faction-table", "Corp", cutStats.corp.factions.toSorted(cutFactionTableComparator))}
          </div>
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutFactionTable("cut-runner-faction-table", "Runner", cutStats.runner.factions.toSorted(cutFactionTableComparator))}
          </div>
        </div>

        <!-- Cut conversion ID tables -->
        <div class="row mt-3 dontprint">
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutIdTable("cut-corp-id-table", "Corp", cutStats.corp.ids.toSorted(cutIdTableComparator))}
          </div>
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutIdTable("cut-runner-id-table", "Runner", cutStats.runner.ids.toSorted(cutIdTableComparator))}
          </div>
        </div>
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
