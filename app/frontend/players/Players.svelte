<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import {
    loadPlayers,
    Player,
    type PlayersData,
    reinstatePlayer as reinstatePlayerRequest,
  } from "./PlayersData";
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

  function downloadStreamingSpreadsheet() {
    if (!data) {
      return;
    }

    const contents = 'Player,"Include in video coverage? (players were notified that in the cut it may not be possible to exclude them)"\n'
      + data.activePlayers.map((player) => `${quoteCsvValue(player.name)},${player.include_in_stream ? "Yes" : "No"}`).join("\n");
    downloadBlob(`Streaming information for ${data.tournament.name}.csv`, new Blob([`"\ufeff"${contents}`], { type: "text/csv" })); // "\ufeff" lets Excel know it's Unicode encoded
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
      
      <!-- TODO: Decks spreadsheet -->
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
