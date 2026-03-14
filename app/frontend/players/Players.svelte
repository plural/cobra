<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadPlayers, type PlayersData } from "./PlayersData";
  import PlayerForm from "./PlayerForm.svelte";

  let { tournamentId }: { tournamentId: number } = $props();

  let data: PlayersData | undefined = $state();

  onMount(async () => {
    data = await loadPlayers(tournamentId);
  });
</script>

<GlobalMessages />

<h2>Players</h2>

{#if data}
  <!-- TODO: Player meeting button -->

  <!-- TODO: Register New Player section -->

  <!-- TODO: Self-registration controls -->

  <!-- TODO: Deck visibility controls -->

  <!-- Active players -->
  <ul class="list-group list-group-flush">
    {#each data.activePlayers as player (player.id)}
      <li class="list-group-item">
        <PlayerForm {player} tournament={data.tournament} tournamentPolicies={data.tournamentPolicies} />
      </li>
    {/each}
  </ul>

  <!-- TODO: Dropped players -->
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
