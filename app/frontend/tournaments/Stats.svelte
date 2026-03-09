<script lang="ts">
  import ApexCharts from "apexcharts";
  import type { ApexOptions } from "apexcharts";
  import { onMount } from "svelte";
  import { loadCutStats, loadPairings, loadStats, PairingsData, type CutIdStats, type CutStats, type IdStats, type Stats } from "../pairings/PairingsData";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import Identity from "../identities/Identity.svelte";
  import { getFaction } from "../utils/factions";
  import Faction from "../widgets/Faction.svelte";

  interface FactionStats {
    name: string;
    count: number;
    color?: string;
  }

  interface CutFactionStats {
    name: string;
    numSwissPlayers: number;
    numCutPlayers: number;
    cutConversion: number;
  }

  interface PieChartData {
    series: number[];
    labels: string[];
    colors: string[];
  }

  let { tournamentId }: { tournamentId: number; } = $props();

  let data: PairingsData | undefined = $state();
  let stats: Stats | undefined = $state();
  let cutStats: CutStats | undefined = $state();
  let corpCutStats: CutFactionStats[] = $state([]);
  let runnerCutStats: CutFactionStats[] = $state([]);

  onMount(async () => {
    data = await loadPairings(tournamentId);
    stats = await loadStats(tournamentId);

    if (data.stages.length > 1 && data.stages.at(-1)?.is_elimination) {
      cutStats = await loadCutStats(tournamentId);

      const factionAggregator = (factionMap: Map<string, CutFactionStats>, id: CutIdStats) => {
        let factionStats = factionMap.get(id.identity.faction);
        factionStats ??= { name: id.identity.faction, numSwissPlayers: 0, numCutPlayers: 0, cutConversion: 0.0 };
        factionStats.numCutPlayers += id.numCutPlayers;
        factionStats.numSwissPlayers += id.numSwissPlayers;
        factionStats.cutConversion = (factionStats.numCutPlayers / factionStats.numSwissPlayers) * 100;

        factionMap.set(id.identity.faction, factionStats);

        return factionMap;
      };
      corpCutStats = Array.from(cutStats.corp.reduce(factionAggregator, new Map<string, CutFactionStats>()).values());
      runnerCutStats = Array.from(cutStats.runner.reduce(factionAggregator, new Map<string, CutFactionStats>()).values());
    }
  });

  $effect(() => {
    if (!stats) {
      return;
    }

    drawPieChart("swiss-corp-faction-chart", stats.swiss.corp);
    drawPieChart("swiss-runner-faction-chart", stats.swiss.runner);
    drawPieChart("elim-corp-faction-chart", stats.elim.corp);
    drawPieChart("elim-runner-faction-chart", stats.elim.runner);
  });

  // Sort by count in descending order, then by ID in ascending order
  function idTableComparator(id1: IdStats, id2: IdStats) {
    return id1.count !== id2.count
      ? id2.count - id1.count
      : id1.identity.name.localeCompare(id2.identity.name);
  }

  // Sort by cut conversion in descending order, then by number of players in ascending order
  function cutFactionTableComparator(id1: CutFactionStats, id2: CutFactionStats) {
    return id1.cutConversion !== id2.cutConversion
      ? id2.cutConversion - id1.cutConversion
      : id2.numCutPlayers - id1.numCutPlayers;
  }

  // Sort by cut conversion in descending order, then by number of players in ascending order
  function cutIdTableComparator(id1: CutIdStats, id2: CutIdStats) {
    return id1.cutConversion !== id2.cutConversion
      ? id2.cutConversion - id1.cutConversion
      : id2.numCutPlayers - id1.numCutPlayers;
  }

  function getPieChartData(ids: IdStats[]) {
    const results: PieChartData = {
      series: [],
      labels: [],
      colors: [],
    };

    ids.reduce((factionCounts, id) => {
      let factionCount = factionCounts.get(id.identity.faction);
      factionCount ??= { name: id.identity.faction, count: 0 };
      factionCount.count += id.count;

      factionCounts.set(id.identity.faction, factionCount);

      return factionCounts;
    }, new Map<string, FactionStats>())
    .forEach((factionCount) => {
      const faction = getFaction(factionCount.name);

      results.series.push(factionCount.count);
      results.labels.push(faction.displayName);
      results.colors.push(faction.color);
    });

    return results;
  }

  function drawPieChart(elementId: string, data: IdStats[]) {
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
  {#snippet idTable(idHeader: string, ids: IdStats[], num_players: number)}
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

  {#snippet cutFactionTable(idHeader: string, factions: CutFactionStats[])}
    <table class="table">
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

  {#snippet cutIdTable(idHeader: string, ids: CutIdStats[])}
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
            {@render idTable("Corp", stats.swiss.corp.toSorted(idTableComparator), stats.swiss.num_players)}
          </div>
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
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
              {@render idTable("Corp", stats.elim.corp.toSorted(idTableComparator), stats.elim.num_players)}
            </div>
            <div class="col-md-6">
              <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
              {@render idTable("Runner", stats.elim.runner.toSorted(idTableComparator), stats.elim.num_players)}
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
            {@render cutFactionTable("Corp", corpCutStats.toSorted(cutFactionTableComparator))}
          </div>
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutFactionTable("Runner", runnerCutStats.toSorted(cutFactionTableComparator))}
          </div>
        </div>

        <!-- Cut conversion ID tables -->
        <div class="row mt-3 dontprint">
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutIdTable("Corp", cutStats.corp.toSorted(cutIdTableComparator))}
          </div>
          <div class="col-md-6">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render cutIdTable("Runner", cutStats.runner.toSorted(cutIdTableComparator))}
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
