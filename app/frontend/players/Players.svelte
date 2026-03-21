<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadPlayers, Player, type PlayersData, reinstatePlayer as reinstatePlayerRequest } from "./PlayersData";
  import PlayerForm from "./PlayerForm.svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  let { tournamentId }: { tournamentId: number } = $props();

  let data: PlayersData | undefined = $state();
  let newPlayer = $state(new Player());

  onMount(async () => {
    data = await loadPlayers(tournamentId);
  });
  
  async function playerSavedCallback() {
    newPlayer = new Player();
    data = await loadPlayers(tournamentId);
  }

  async function playerDroppedCallback() {
    data = await loadPlayers(tournamentId);
  }

  async function playerDeletedCallback() {
    data = await loadPlayers(tournamentId);
  }

  async function reinstatePlayer(player: Player) {
    const success = await reinstatePlayerRequest(tournamentId, player);
    if (!success) {
      return;
    }

    data = await loadPlayers(tournamentId);
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

  <!-- TODO: Register New Player section -->
  <div class="alert alert-secondary mt-4">
    <h4>Register New Player</h4>
    <PlayerForm player={newPlayer} tournament={data.tournament} tournamentPolicies={data.tournamentPolicies} savedCallback={playerSavedCallback} />
  </div>

  <!-- TODO: Self-registration controls -->

  <!-- TODO: Deck visibility controls -->

  <!-- Active players -->
  <h3 class="mt-4">Players</h3>
  <ul class="list-group">
    {#each data.activePlayers as player (player.id)}
      <li class="list-group-item">
        <PlayerForm {player} tournament={data.tournament} tournamentPolicies={data.tournamentPolicies} droppedCallback={playerDroppedCallback} deletedCallback={playerDeletedCallback} />
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
            <td>{player.name} ({player.corp_id.name}, {player.runner_id.name})</td>
            <td>
              <button type="button" class="btn btn-warning" onclick={() => reinstatePlayer(player)}>
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
