<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadDecks, loadPlayers, Player, type PlayersData, reinstatePlayer as reinstatePlayerRequest } from "./PlayersData";
  import PlayerForm from "./PlayerForm.svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { downloadBlob, quoteCsvValue } from "../utils/files";

  let { tournamentId }: { tournamentId: number } = $props();

  let data: PlayersData | undefined = $state();
  let newPlayer = $state(new Player());

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    data = await loadPlayers(tournamentId);
  }

  async function newPlayerSavedCallback() {
    newPlayer = new Player();
    await loadData();
  }

  async function downloadDecksSpreadsheet() {
    if (!data) {
      return;
    }

    // TODO: Update buttons

    const decks = await loadDecks(tournamentId);
    const headerCsv = decks.map((deck) => `Player,${quoteCsvValue(deck.details.player_name)},`).join(",,")
      + "\n" + decks.map((deck) => `Deck,${quoteCsvValue(deck.details.name ?? "")},`).join(",,")
      + "\n\n" + decks.map(() => "Min,Identity,Max").join(",,")
      + "\n" + decks.map((deck) => `${deck.details.min_deck_size},${quoteCsvValue(deck.details.identity_title)},${deck.details.max_influence}`).join(",,");

    const maxCards = decks.reduce((max, deck) => Math.max(max, deck.cards.length), 0);
    let cardCsv = decks.map(() => "Qty,Card Name,Inf").join(",,");
    for (const i of Array(maxCards).keys()) {
      cardCsv += "\n" + decks.map((deck) => i < deck.cards.length ? `${deck.cards[i].quantity},${quoteCsvValue(deck.cards[i].title)},${deck.cards[i].influence > 0 ? deck.cards[i].influence : ""}` : ",,").join(",,");
    }
    cardCsv += "\n\n" + decks.map((deck) => `${deck.cards.reduce((total, card) => total + card.quantity, 0)},Totals,${deck.cards.reduce((total, card) => total + card.influence, 0)}`).join(",,");

    // TODO: Update buttons

    downloadBlob(`Decks for ${data.tournament.name}.csv`, new Blob([`\ufeff${headerCsv}\n\n${cardCsv}`], { type: "text/csv" })); // "\ufeff" lets Excel know it's Unicode encoded
  }

  function downloadStreamingSpreadsheet() {
    if (!data) {
      return;
    }

    // TODO: Update buttons
    const contents = 'Player,"Include in video coverage? (players were notified that in the cut it may not be possible to exclude them)"\n'
      + data.activePlayers.map((player) => `${quoteCsvValue(player.name)},${player.include_in_stream ? "Yes" : "No"}`).join("\n");
    downloadBlob(`Streaming information for ${data.tournament.name}.csv`, new Blob([`\ufeff${contents}`], { type: "text/csv" })); // "\ufeff" lets Excel know it's Unicode encoded
    // TODO: Update buttons
  }

  async function reinstatePlayer(player: Player) {
    const success = await reinstatePlayerRequest(tournamentId, player);
    if (!success) {
      return;
    }

    await loadData();
  }
</script>

<GlobalMessages />

{#if data}
  <a
    href={`/tournaments/${tournamentId}/players/meeting?back_to=players`}
    class="btn btn-primary"
  >
    <FontAwesomeIcon icon="list-ul" /> Player meeting
  </a>

  <!-- Register New Player -->
  <div class="alert alert-secondary mt-4">
    <h4>Register New Player</h4>
    <PlayerForm player={newPlayer} tournament={data.tournament} tournamentPolicies={data.tournamentPolicies} savedCallback={newPlayerSavedCallback} />
  </div>

  <!-- Players -->
  <h3 class="mt-4">
    Players

    <!-- TODO: Self-registration controls -->
    
    <!-- Deck controls -->
    {#if data.tournament.nrdb_deck_registration}
      <!-- TODO: Deck visibility dropdown -->
      
      <!-- Decks spreadsheet -->
      <button type="button" class="btn btn-link text-info" onclick={downloadDecksSpreadsheet}>
        <FontAwesomeIcon icon="download" />
        Decks spreadsheet
      </button>
    {/if}
    
    <!-- Streaming spreadsheet -->
    {#if data.tournament.allow_streaming_opt_out}
      <button type="button" class="btn btn-link text-info" onclick={downloadStreamingSpreadsheet}>
        <FontAwesomeIcon icon="download" />
        Streaming spreadsheet
      </button>
    {/if}
  </h3>
  <ul class="list-group">
    {#each data.activePlayers as player (player.id)}
      <li class="list-group-item">
        <PlayerForm {player} tournament={data.tournament} tournamentPolicies={data.tournamentPolicies} savedCallback={loadData} droppedCallback={loadData} deletedCallback={loadData} />
      </li>
    {/each}
  </ul>

  <!-- Dropped players -->
  {#if data.droppedPlayers}
    <h3 class="mt-4">Dropped Players</h3>
    <table class="table table-striped">
      <tbody>
        {#each data.droppedPlayers as player (player.id)}
          <tr>
            <td>
              {player.name} ({player.corp_id.name}, {player.runner_id.name})
            </td>
            <td>
              <button
                type="button"
                class="btn btn-warning"
                onclick={() => reinstatePlayer(player)}
              >
                <FontAwesomeIcon icon="arrow-up" /> Reinstate
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
