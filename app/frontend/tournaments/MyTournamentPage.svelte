<script lang="ts">
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { onMount } from "svelte";
  import {
    loadPairings,
    PairingsData,
    type Pairing,
  } from "../pairings/PairingsData";
  import PlayerDisplay from "../pairings/PlayerDisplay.svelte";
  import SelfReportOptions from "../pairings/SelfReportOptions.svelte";
  import { reportScore, type ScoreReport } from "../pairings/SelfReport";

  let {
    tournamentId,
    userId,
  }: {
    tournamentId: number;
    userId: number;
  } = $props();

  let data: PairingsData | undefined = $state();
  let showPreviousRounds = $state(false);
  let pairingCount = $derived(
    data
      ? data.stages.reduce(
          (acc, s) =>
            acc + s.rounds.reduce((acc, r) => acc + r.pairings.length, 0),
          0,
        )
      : 0,
  );

  onMount(async () => {
    data = await loadPairings(tournamentId, userId);
  });

  function isBye(pairing: Pairing): boolean {
    return pairing.player1.id === 0 || pairing.player2.id === 0;
  }

  function getMySide(pairing: Pairing) {
    const side =
      pairing.player1.user_id === userId
        ? pairing.player1.side
        : pairing.player2.side;
    return side ? side.charAt(0).toUpperCase() + side.slice(1) : "";
  }

  async function reportScoreCallback(
    roundId: number,
    pairingId: number,
    report: ScoreReport,
    selfReport: boolean,
  ) {
    const success = await reportScore(
      tournamentId,
      roundId,
      pairingId,
      report,
      selfReport,
    );
    if (!success) {
      return;
    }

    data = await loadPairings(tournamentId, userId);
  }
</script>

{#if data}
  <div class="container">
    <h2>Me</h2>

    {#if pairingCount === 0}
      <div class="row">
        <div class="col-12">
          <div class="alert alert-info">
            <FontAwesomeIcon icon="info-circle" />
            You don't have any pairings in this tournament yet.
          </div>
        </div>
      </div>
    {:else}
      {#if pairingCount > 1}
        <div class="row">
          <div class="col-12">
            <button
              class="btn btn-link btn-sm p-0 mb-2 d-flex align-items-center small"
              onclick={() => (showPreviousRounds = !showPreviousRounds)}
            >
              <FontAwesomeIcon
                icon={showPreviousRounds ? "chevron-down" : "chevron-right"}
              />
              <span class="ml-2">
                {showPreviousRounds ? "Hide" : "Show"} previous rounds
              </span>
            </button>
          </div>
        </div>
      {/if}

      <div class="row col-12 table-responsive">
        <table id="rounds_table" class="table">
          <thead>
            <tr>
              <th>Round</th>
              <th>Table</th>
              {#if data.tournament.swiss_format === "single_sided"}
                <th>Side</th>
              {/if}
              <th>Opponent</th>
              <th class="text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {#each data.stages as stage (stage.id)}
              {#each stage.rounds as round, idx (round.id)}
                {#if showPreviousRounds || idx === stage.rounds.length - 1}
                  {#each round.pairings as pairing (pairing.id)}
                    <tr>
                      <td>
                        {stage.is_elimination ? "Cut " : ""}{round.number}
                      </td>
                      <td>{isBye(pairing) ? "" : pairing.table_number}</td>
                      {#if stage.is_single_sided}
                        <td>{isBye(pairing) ? "" : getMySide(pairing)}</td>
                      {/if}
                      <td>
                        {#if isBye(pairing)}
                          (Bye)
                        {:else}
                          <PlayerDisplay
                            player={pairing.player1.user_id === userId
                              ? pairing.player2
                              : pairing.player1}
                            {pairing}
                            left_or_right="left"
                            is_single_sided={stage.is_single_sided}
                          />
                        {/if}
                      </td>
                      <td class="text-center">
                        {#if pairing.score_label.trim() !== "" && pairing.score_label.trim() !== "-"}
                          {pairing.score_label}
                          {#if pairing.intentional_draw}
                            <span
                              class="badge badge-pill badge-secondary score-badge"
                            >
                              ID
                            </span>
                          {/if}
                          {#if pairing.two_for_one}
                            <span
                              class="badge badge-pill badge-secondary score-badge"
                            >
                              2 for 1
                            </span>
                          {/if}
                        {:else}
                          {#if pairing.policy.self_report}
                            <SelfReportOptions
                              {stage}
                              {pairing}
                              reportScoreCallback={async (
                                pairingId: number,
                                report: ScoreReport,
                                selfReport: boolean,
                              ) => {
                                await reportScoreCallback(
                                  round.id,
                                  pairingId,
                                  report,
                                  selfReport,
                                );
                              }}
                            />
                          {/if}
                          {#if pairing.self_reports && pairing.self_reports.length !== 0}
                            Report: {pairing.self_reports[0].label}
                          {/if}
                        {/if}
                      </td>
                    </tr>
                  {/each}
                {/if}
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
