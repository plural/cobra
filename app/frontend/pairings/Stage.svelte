<script lang="ts">
  import Round from "./Round.svelte";
  import type {
    PairingsContext,
    Stage,
    TournamentPolicies,
  } from "./PairingsData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { getContext } from "svelte";
  import type { ScoreReport } from "./SelfReport";
  import type { Tournament } from "../tournaments/TournamentSettings";

  let {
    tournament,
    stage,
    startExpanded,
    tournamentPolicies,
    deletePairingCallback,
    changePlayerSideCallback,
    reportScoreCallback,
    completeRoundCallback,
    updateTimerCallback,
  }: {
    tournament: Tournament;
    stage: Stage;
    startExpanded: boolean;
    tournamentPolicies?: TournamentPolicies;
    deletePairingCallback?: (roundId: number, pairingId: number) => void;
    changePlayerSideCallback?: (
      roundId: number,
      pairingId: number,
      side: string,
    ) => void;
    reportScoreCallback?: (
      roundId: number,
      pairingId: number,
      report: ScoreReport,
      selfReport: boolean,
    ) => void;
    completeRoundCallback?: (roundId: number) => void;
    updateTimerCallback?: (
      roundId: number,
      length_minutes: number,
      operation: string,
    ) => void;
  } = $props();

  const pairingsContext: PairingsContext = getContext("pairingsContext");
</script>

<div id={`stage${stage.id}`} class="accordion mb-3" role="tablist">
  <div class="row mb-1">
    <div class="col-sm-6 d-flex align-items-baseline gap-2">
      <h4>{stage.name}</h4>
    </div>

    <!-- Admin controls -->
    {#if pairingsContext.showOrganizerView}
      <div class="col-sm-6 d-flex justify-content-end" aria-label="admin controls">
        {#if !stage.is_elimination && tournamentPolicies?.custom_table_numbering}
          <a
            href="/tournaments/{tournament.id}/stages/{stage.id}"
            class="btn btn-warning mx-1"
            aria-label="edit stage"
          >
            <FontAwesomeIcon icon="pencil" />
            Edit Stage
          </a>
        {/if}
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
      round={stage.rounds[stage.rounds.length - 1]}
      {stage}
      {startExpanded}
      {deletePairingCallback}
      {changePlayerSideCallback}
      {reportScoreCallback}
      completeCallback={completeRoundCallback}
      {updateTimerCallback}
    />
  {:else}
    {#each stage.rounds as round, index (round.id)}
      <Round
        {tournament}
        {round}
        {stage}
        startExpanded={startExpanded && index === stage.rounds.length - 1}
        {deletePairingCallback}
        {changePlayerSideCallback}
        {reportScoreCallback}
        completeCallback={completeRoundCallback}
        {updateTimerCallback}
      />
    {/each}
  {/if}
</div>
