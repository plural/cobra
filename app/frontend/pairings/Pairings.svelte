<script lang="ts">
  import { onMount } from "svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { loadPairings, type Pairing } from "./PairingsData";
  import PlayerDisplay from "../pairings/PlayerDisplay.svelte";

  let {
    tournamentId,
    roundId,
  }: {
    tournamentId: number;
    roundId: number;
  } = $props();

  let isSingleSided = $state(true);
  let viewDecks = $state(false);
  let roundNumber = $state(0);
  let pairings = $state<Pairing[]>();

  onMount(async () => {
    pairings = undefined;
    const pairingsData = await loadPairings(tournamentId);

    for (const stage of pairingsData.stages) {
      const round = stage.rounds.find((round) => round.id === roundId);
      if (!round) {
        continue;
      }

      isSingleSided = stage.is_single_sided;
      viewDecks = stage.view_decks;
      roundNumber = round.number;

      // Create duplicate pairings with the players swapped for the alphabetized display
      pairings = [];
      for (const pairing of round.pairings) {
        pairings.push(pairing);
        pairings.push({
          ...pairing,
          player1: pairing.player2,
          player2: pairing.player1,
        });
      }
      pairings.sort((p1, p2) => {
        const p1Name = p1.player1.name_with_pronouns.toLowerCase();
        const p2Name = p2.player1.name_with_pronouns.toLowerCase();
        if (p1Name < p2Name) {
          return -1;
        } else if (p1Name > p2Name) {
          return 1;
        }
        return 0;
      });
    }
  });
</script>

<p>
  <a href={`/beta/tournaments/${tournamentId}/rounds`} class="btn btn-primary">
    <FontAwesomeIcon icon="arrow-left" /> Back to Pairings
  </a>
</p>

<h2>Round {roundNumber} pairings</h2>

{#if pairings}
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Table</th>
        {#if viewDecks}
          <th>Decks</th>
        {/if}
        <th>Player</th>
        <th>Opponent</th>
      </tr>
    </thead>
    <tbody>
      {#each pairings as pairing (pairing.player1)}
        <tr>
          <td>{pairing.table_number}</td>
          {#if viewDecks}
            <td>
              <a
                class="ml-2"
                href={`/tournaments/${tournamentId}/rounds/${roundId}/pairings/${pairing.id}/view_decks`}
              >
                <FontAwesomeIcon icon="eye" /> View decks
              </a>
            </td>
          {/if}
          <td>
            <PlayerDisplay
              player={pairing.player1}
              {pairing}
              left_or_right="left"
              is_single_sided={isSingleSided}
              show_ids={false}
            />
          </td>
          <td>
            <PlayerDisplay
              player={pairing.player2}
              {pairing}
              left_or_right="right"
              is_single_sided={isSingleSided}
              show_ids={false}
            />
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
