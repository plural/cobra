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
  import type { Identity as IdentityType } from "../identities/Identity";
  import Identity from "../identities/Identity.svelte";

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

  let summary = $derived.by(() => {
    let result = {
      overallWins: 0,
      overallLosses: 0,
      overallTies: 0,
      totalPoints: 0,
      corpWins: 0,
      corpLosses: 0,
      corpTies: 0,
      runnerWins: 0,
      runnerLosses: 0,
      runnerTies: 0,
      corpDeck: undefined as IdentityType | undefined,
      runnerDeck: undefined as IdentityType | undefined,
    };
    if (!data) return result;

    for (const stage of data.stages) {
      for (const round of stage.rounds) {
        for (const pairing of round.pairings) {
          const isMe1 = pairing.player1.user_id === userId;
          const isMe2 = pairing.player2.user_id === userId;

          if (!isMe1 && !isMe2) continue;

          if (!result.corpDeck || !result.runnerDeck) {
            const myPlayer = isMe1 ? pairing.player1 : pairing.player2;
            if (myPlayer.corp_id.name) result.corpDeck = myPlayer.corp_id;
            if (myPlayer.runner_id.name) result.runnerDeck = myPlayer.runner_id;
          }

          if (isBye(pairing)) {
            result.overallWins += 1;
            result.totalPoints += isMe1 ? pairing.score1 : pairing.score2;
            continue;
          }

          if (!pairing.reported) continue;

          const myScore = isMe1 ? pairing.score1 : pairing.score2;
          const oppScore = isMe1 ? pairing.score2 : pairing.score1;

          result.totalPoints += myScore;

          if (myScore > oppScore) result.overallWins += 1;
          else if (myScore < oppScore) result.overallLosses += 1;
          else result.overallTies += 1;

          let mySide = "";
          if (stage.is_single_sided) {
            mySide = isMe1 ? (pairing.player1.side ?? "") : (pairing.player2.side ?? "");
          }

          if (!stage.is_single_sided || mySide === "corp") {
            const myCorp = stage.is_single_sided ? myScore : (isMe1 ? pairing.score1_corp : pairing.score2_corp);
            const oppRunner = stage.is_single_sided ? oppScore : (isMe1 ? pairing.score2_runner : pairing.score1_runner);
            if (myCorp > oppRunner) result.corpWins += 1;
            else if (myCorp < oppRunner) result.corpLosses += 1;
            else result.corpTies += 1;
          }

          if (!stage.is_single_sided || mySide === "runner") {
            const myRunner = stage.is_single_sided ? myScore : (isMe1 ? pairing.score1_runner : pairing.score2_runner);
            const oppCorp = stage.is_single_sided ? oppScore : (isMe1 ? pairing.score2_corp : pairing.score1_corp);
            if (myRunner > oppCorp) result.runnerWins += 1;
            else if (myRunner < oppCorp) result.runnerLosses += 1;
            else result.runnerTies += 1;
          }
        }
      }
    }
    return result;
  });

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
    <h2>My Results</h2>

    {#if pairingCount > 0}
      <div class="row mb-3">
        <div class="col-12 col-md-6">
        <h3>Total Points: {summary.totalPoints} ({summary.overallWins} - {summary.overallLosses} - {summary.overallTies})</h3>
          <table class="table table-sm table-bordered">
            <thead>
              <tr>
                <th></th>
                <th class="text-center">W</th>
                <th class="text-center">L</th>
                <th class="text-center">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  Corp
                  {#if summary.corpDeck}
                    <div class="small font-weight-normal text-muted"><Identity identity={summary.corpDeck} /></div>
                  {/if}
                </th>
                <td class="text-center">{summary.corpWins}</td>
                <td class="text-center">{summary.corpLosses}</td>
                <td class="text-center">{summary.corpTies}</td>
              </tr>
              <tr>
                <th scope="row">
                  Runner
                  {#if summary.runnerDeck}
                    <div class="small font-weight-normal text-muted"><Identity identity={summary.runnerDeck} /></div>
                  {/if}
                </th>
                <td class="text-center">{summary.runnerWins}</td>
                <td class="text-center">{summary.runnerLosses}</td>
                <td class="text-center">{summary.runnerTies}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    {/if}

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
            {#each data.stages as stage, stageIdx (stage.id)}
              {#if showPreviousRounds || stageIdx == data.stages.length - 1}
                {#each stage.rounds as round, roundIdx (round.id)}
                  {#if showPreviousRounds || roundIdx === stage.rounds.length - 1}
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
              {/if}
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
