<script lang="ts">
  import { redirectRequest } from "../utils/network";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import type { Round } from "./PairingsData";

  let {
    tournamentId,
    round,
  }: {
    tournamentId: number;
    round: Round;
  } = $props();

  let roundTimerLength = $state(round.length_minutes);

  function updateTimer(operation: string) {
    if (
      operation === "reset" &&
      !confirm("This will clear all elapsed time in the round. Are you sure?")
    ) {
      return;
    }

    void redirectRequest(
      `/beta/tournaments/${tournamentId}/rounds/${round.id}/update_timer`,
      "PATCH",
      { length_minutes: roundTimerLength, operation: operation },
    );
  }
</script>

<div class="form-inline mt-2 round-timer-form">
  <div class="form-group">
    <label for="round{round.id}Length">Round timer length (minutes)</label>
    <input
      id="round{round.id}Length"
      size="3"
      class="form-control ml-2 mr-2"
      value={roundTimerLength}
    />
    {#if round.timer.running}
      <button
        type="button"
        class="btn btn-danger"
        onclick={() => {
          updateTimer("stop");
        }}
      >
        <FontAwesomeIcon icon="clock-o" /> Pause
      </button>
    {:else if round.timer.paused}
      <button
        type="button"
        class="btn btn-success"
        onclick={() => {
          updateTimer("start");
        }}
      >
        <FontAwesomeIcon icon="clock-o" /> Resume
      </button>
    {:else if !round.timer.started}
      <button
        type="button"
        class="btn btn-success"
        onclick={() => {
          updateTimer("start");
        }}
      >
        <FontAwesomeIcon icon="clock-o" /> Start
      </button>
    {/if}
    <button
      class="btn btn-info ml-2"
      onclick={() => {
        updateTimer("reset");
      }}
    >
      <FontAwesomeIcon icon="undo" /> Reset
    </button>
  </div>
</div>
