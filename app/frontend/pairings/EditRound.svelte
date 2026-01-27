<script lang="ts">
  import { onMount, setContext } from "svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { type RoundData, loadRound } from "./RoundData";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import PairingComponent from "./Pairing.svelte";
  import {
    completeRound,
    createPairing as createPairingRequest,
    deletePairing,
    deleteRound as deleteRoundRequest,
    rePairRound,
    type NewPairing,
  } from "./PairingsData";
  import { reportScore, resetReports, type ScoreReport } from "./SelfReport";

  let {
    tournamentId,
    roundId,
  }: {
    tournamentId: number;
    roundId: number;
  } = $props();

  let data = $state<RoundData>();
  let newPairing = $state<NewPairing>({
    table_number: 0,
    player1_id: 0,
    side: "",
    player2_id: 0,
  });

  setContext("pairingsContext", { showOrganizerView: true });

  onMount(async () => {
    data = await loadRound(tournamentId, roundId);
  });

  async function rePair() {
    if (!data || !confirm("Are you sure? This cannot be reversed.")) {
      return;
    }

    const success = await rePairRound(tournamentId, roundId);
    if (!success) {
      return;
    }

    data = await loadRound(tournamentId, roundId);
  }

  async function complete(completed: boolean) {
    if (
      !data ||
      (data.round.pairings.length != data.round.pairings_reported &&
        !confirm(
          `${data.round.pairings.length - data.round.pairings_reported} pairings have not been reported. Are you sure you want to complete this round?`,
        ))
    ) {
      return;
    }

    const success = await completeRound(tournamentId, roundId, completed);
    if (!success) {
      return;
    }

    data = await loadRound(tournamentId, roundId);
  }

  async function deleteRound() {
    if (!data || !confirm("Are you sure? This cannot be reversed.")) {
      return;
    }

    const success = await deleteRoundRequest(tournamentId, roundId);
    if (!success) {
      return;
    }

    window.location.replace(`/beta/tournaments/${tournamentId}/rounds`);
  }

  async function createPairing(e: SubmitEvent) {
    e.preventDefault();

    const success = await createPairingRequest(
      tournamentId,
      roundId,
      newPairing,
    );
    if (!success) {
      return;
    }

    data = await loadRound(tournamentId, roundId);
  }

  async function deletePairingCallback(pairingId: number) {
    if (!data || !confirm("Are you sure? This cannot be reversed.")) {
      return;
    }

    const success = await deletePairing(tournamentId, roundId, pairingId);
    if (!success) {
      return;
    }

    data = await loadRound(tournamentId, roundId);
  }

  async function reportScoreCallback(pairingId: number, report: ScoreReport) {
    const success = await reportScore(
      tournamentId,
      roundId,
      pairingId,
      report,
      false,
    );
    if (!success) {
      return;
    }

    data = await loadRound(tournamentId, roundId);
  }

  async function resetReportsCallback(pairingId: number) {
    const success = await resetReports(tournamentId, roundId, pairingId);
    if (!success) {
      return;
    }

    data = await loadRound(tournamentId, roundId);
  }
</script>

<GlobalMessages />

{#if data}
  <div class="col-12">
    <h2>Round {data.round.number}</h2>

    <p>
      <a href="/beta/tournaments/{tournamentId}/rounds" class="btn btn-primary">
        <FontAwesomeIcon icon="arrow-left" /> Back to pairings
      </a>

      <!-- Edit controls -->
      {#if data.policy?.update}
        <button type="button" class="btn btn-warning" onclick={rePair}>
          <FontAwesomeIcon icon="refresh" /> Re-pair
        </button>
        {#if data.round.completed}
          <button
            type="button"
            class="btn btn-warning"
            onclick={() => {
              complete(false);
            }}
          >
            <FontAwesomeIcon icon="backward" /> Uncomplete
          </button>
        {:else}
          <button
            type="button"
            class="btn btn-warning"
            onclick={() => {
              complete(true);
            }}
          >
            <FontAwesomeIcon icon="check" /> Complete
          </button>
        {/if}
        <a
          href={`/tournaments/${tournamentId}/rounds/${roundId}/edit`}
          class="btn btn-warning"
        >
          <FontAwesomeIcon icon="wrench" /> Advanced
        </a>
        <button type="button" class="btn btn-danger" onclick={deleteRound}>
          <FontAwesomeIcon icon="trash" /> Delete round
        </button>
      {/if}
    </p>

    <!-- Pairings -->
    {#each data.round.pairings as pairing, index (pairing.id)}
      <hr />
      <PairingComponent
        tournament={data.tournament}
        bind:pairing={data.round.pairings[index]}
        round={data.round}
        stage={data.stage}
        deleteCallback={deletePairingCallback}
        {reportScoreCallback}
        {resetReportsCallback}
      />
    {/each}
    <hr />
  </div>

  <h3 class="mt-2 col-12">Unpaired players</h3>
  <div class="col-12">
    {#if data.round.unpaired_players && data.round.unpaired_players.length !== 0}
      {#each data.round.unpaired_players as player (player.id)}
        <div>
          {player.name}
          {#if player.active === false}
            (Dropped)
          {/if}
        </div>
      {/each}

      {#snippet playerOptions()}
        <option value="">(Bye)</option>
        {#each data?.round.unpaired_players as player (player.id)}
          <option value={player.id}>{player.name}</option>
        {/each}
      {/snippet}

      <h3 class="mt-2">Create pairing</h3>
      <form
        id="new_pairing"
        onsubmit={createPairing}
        class="form-inline col-12"
      >
        <input
          aria-label="New pairing table number"
          type="number"
          class="form-control"
          placeholder="Table number"
          bind:value={newPairing.table_number}
        />
        <select
          aria-label={`New pairing player 1`}
          class="form-control mx-2"
          bind:value={newPairing.player1_id}
        >
          {@render playerOptions()}
        </select>
        {#if data.stage.is_single_sided}
          <select
            aria-label="New pairing player 1 side"
            class="form-control mx-2"
            bind:value={newPairing.side}
          >
            <option value="">Player 1 Side</option>
            <option value="player1_is_corp">Corp</option>
            <option value="player1_is_runner">Runner</option>
          </select>
        {/if}
        vs
        <select
          aria-label={`New pairing player 2`}
          class="form-control mx-2"
          bind:value={newPairing.player2_id}
        >
          {@render playerOptions()}
        </select>
        <button type="submit" class="btn btn-success">
          <FontAwesomeIcon icon="plus" /> Create
        </button>
      </form>
    {:else}
      None
    {/if}
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
