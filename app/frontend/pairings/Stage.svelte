<script lang="ts">
  import Round from "./Round.svelte";
  import type {
    PairingsContext,
    Stage,
    Tournament,
    TournamentPolicies,
  } from "./PairingsData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { getContext } from "svelte";
  import type { ScoreReport } from "./SelfReport";

  let {
    tournament,
    stage = $bindable(),
    startExpanded,
    tournamentPolicies,
    deleteCallback,
    deletePairingCallback,
    reportScoreCallback,
    completeRoundCallback,
  }: {
    tournament: Tournament;
    stage: Stage;
    startExpanded: boolean;
    tournamentPolicies?: TournamentPolicies;
    deleteCallback?: (stageId: number) => void;
    deletePairingCallback?: (roundId: number, pairingId: number) => void;
    reportScoreCallback?: (
      roundId: number,
      pairingId: number,
      report: ScoreReport,
      selfReport: boolean,
    ) => void;
    completeRoundCallback?: (roundId: number) => void;
  } = $props();

  const pairingsContext: PairingsContext = getContext("pairingsContext");
</script>

<div class="accordion mb-3" role="tablist">
  <div class="row mb-1">
    <div class="col-sm-10 d-flex align-items-baseline gap-2">
      <h4>{stage.name}</h4>
    </div>

    <!-- Admin controls -->
    {#if pairingsContext.showOrganizerView}
      <div class="col-sm-2" aria-label="admin controls">
        {#if !stage.is_elimination && tournamentPolicies?.custom_table_numbering}
          <a
            href="/tournaments/{tournament.id}/stages/{stage.id}"
            class="btn btn-warning mx-1"
          >
            <FontAwesomeIcon icon="pencil" />
          </a>
        {/if}
        <button class="btn btn-danger mx-1" onclick={() => { deleteCallback?.(stage.id); }} aria-label="delete">
          <FontAwesomeIcon icon="trash" />
        </button>
      </div>
    {/if}
  </div>

  <!-- Rounds -->
  {#if !pairingsContext.showOrganizerView && stage.rounds.length > 0 && stage.rounds[stage.rounds.length - 1].pairings.length > 30}
    <div class="alert alert-info">
      Due to the number of players, only the most recent round will be displayed
      on this page to help page load.
    </div>
    <Round
      {tournament}
      bind:round={stage.rounds[stage.rounds.length - 1]}
      {stage}
      {startExpanded}
      {deletePairingCallback}
      {reportScoreCallback}
      completeCallback={completeRoundCallback}
    />
  {:else}
    {#each stage.rounds as round, index (round.id)}
      <Round
        {tournament}
        bind:round={stage.rounds[index]}
        {stage}
        startExpanded={startExpanded && index === stage.rounds.length - 1}
        {deletePairingCallback}
        {reportScoreCallback}
        completeCallback={completeRoundCallback}
      />
    {/each}
  {/if}
</div>
