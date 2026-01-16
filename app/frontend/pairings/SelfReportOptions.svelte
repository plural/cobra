<script lang="ts">
  import { type Pairing, Player, type Stage } from "./PairingsData";
  import { type ScoreReport, scorePresets } from "./SelfReport";
  import ModalDialog from "../widgets/ModalDialog.svelte";

  let {
    stage,
    pairing = $bindable(),
    reportScoreCallback,
  }: {
    stage: Stage;
    pairing: Pairing;
    reportScoreCallback?: (
      pairingId: number,
      report: ScoreReport,
      selfReport: boolean,
    ) => void;
  } = $props();

  let customReporting = $state(false);
  let left_player_number = $state(1);
  let left_player = $state(new Player());
  let right_player = $state(new Player());

  left_player = pairing.player1;
  right_player = pairing.player2;
  if (stage.is_single_sided && pairing.player1.side === "runner") {
    left_player_number = 2;
    left_player = pairing.player2;
    right_player = pairing.player1;
  }

  let customReport: ScoreReport = $derived({
    score1: pairing.score1,
    score2: pairing.score2,
    intentional_draw: pairing.intentional_draw,
    score1_corp: 0,
    score2_runner: 0,
    score1_runner: 0,
    score2_corp: 0,
  });

  function onCustomReportClicked() {
    customReporting = !customReporting;
  }
</script>

<button
  type="button"
  class="btn btn-primary"
  data-toggle="modal"
  data-target="#reportModal"
>
  Report Pairing
</button>

<ModalDialog id="reportModal" headerText="Report Pairing">
  <p>Please click the button for the result to report this pairing:</p>
  <p>
    {left_player.name_with_pronouns} vs. {right_player.name_with_pronouns}
  </p>
  <div style="gap: 20px;" class="d-flex flex-row w-100 justify-content-center">
    {#if !customReporting}
      {#each scorePresets(stage, pairing) as report (report.label)}
        <button
          type="button"
          class="btn btn-primary"
          data-dismiss="modal"
          onclick={() => {
            reportScoreCallback?.(pairing.id, report, true);
          }}
        >
          {report.extra_self_report_label ?? report.label}
        </button>
      {/each}
    {:else}
      {#if left_player_number === 1}
        <input
          type="text"
          id="name"
          style="width: 2.5em;"
          class="form-control"
          bind:value={pairing.score1}
        />
        <p>-</p>
        <input
          type="text"
          id="name"
          style="width: 2.5em;"
          class="form-control"
          bind:value={pairing.score2}
        />
      {:else}
        <input
          type="text"
          id="name"
          style="width: 2.5em;"
          class="form-control"
          bind:value={pairing.score2}
        />
        <p>-</p>
        <input
          type="text"
          id="name"
          style="width: 2.5em;"
          class="form-control"
          bind:value={pairing.score1}
        />
      {/if}
      <button
        type="button"
        class="btn btn-primary"
        data-dismiss="modal"
        id="option-custom"
        onclick={() => {
          reportScoreCallback?.(pairing.id, customReport, true);
        }}
      >
        Submit
      </button>
    {/if}
    <button
      type="button"
      class="btn btn-primary"
      id="option-custom"
      onclick={onCustomReportClicked}
    >
      {customReporting ? "Presets" : "Custom"}
    </button>
  </div>
</ModalDialog>
