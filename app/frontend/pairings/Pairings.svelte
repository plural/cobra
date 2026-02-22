<script lang="ts">
  import { onMount } from "svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { loadPairings, Player, type Pairing } from "./PairingsData";

  let { tournamentId, roundId }: { tournamentId: number; roundId: number; } = $props();

  let format = $state("");
  let pairings = $state<Pairing[]>();
  let betaEnabledCookie: CookieListItem | null = $state(null);

  onMount(async () => {
    pairings = undefined;
    const pairingsData = await loadPairings(tournamentId);
    
    for (const stage of pairingsData.stages) {
      const round = stage.rounds.find(round => round.id === roundId);
      if (round) {
        format = stage.format;
        pairings = round.pairings;
        break;
      }
    }

    betaEnabledCookie = await cookieStore.get("beta_enabled");
  });
</script>

<p>
  <a
    href={betaEnabledCookie?.value === "true"
      ? `/beta/tournaments/${tournamentId}/rounds`
      : `/tournaments/${tournamentId}/rounds`}
    class="btn btn-primary"
  >
    <FontAwesomeIcon icon="arrow-left" /> Back to Pairings
  </a>
</p>

<h2>Round {roundId} pairings</h2>

{#if pairings}
  {#snippet playerDisplay(player: Player)}
    {#if format === "single_sided_swiss"}
      {`${player.name_with_pronouns} (${player.side_label})`}
    {:else}
      {`${player.name_with_pronouns}`}
    {/if}
  {/snippet}

  <table class="table table-striped">
    <thead>
      <tr>
        <th>Table</th>
        <!-- TODO: Decks -->
        <th>Player</th>
        <th>Opponent</th>
      </tr>
    </thead>
    <tbody>
      {#each pairings as pairing (pairing.id)}
        <tr>
          <td>{pairing.table_number}</td>
          <!-- TODO: Decks -->
          <td>
            {@render playerDisplay(pairing.player1)}
          </td>
          <td>
            {@render playerDisplay(pairing.player2)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
