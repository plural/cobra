<script lang="ts">
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import Identity from "../identities/Identity.svelte";
  import type { MyTournamentData, Pairing } from "../entrypoints/my_tournament";

  let { data }: { data: MyTournamentData } = $props();

  let showPreviousRounds = $state(false);

  function isBye(pairing: Pairing): boolean {
    return !pairing.opponent.name || pairing.opponent.name === "";
  }

  function getMySide(pairing: Pairing): "Corp" | "Runner" | null {
    if (
      pairing.format !== "single_sided_swiss" &&
      !pairing.format.includes("elim")
    )
      return null;
    if (pairing.side === 1) return "Corp";
    if (pairing.side === 2) return "Runner";
    return null;
  }

  function getRoundLabel(pairing: Pairing): string {
    const prefix = pairing.format.includes("elim") ? "Cut " : "";
    return `${prefix}${String(pairing.round_number)}`;
  }

  const hasSideCol = $derived(
    (data.pairings ?? []).some(
      (p) => p.format === "single_sided_swiss" || p.format.includes("elim"),
    ),
  );
</script>

<div class="container">
  <h2>Me</h2>
  {#if !data.pairings || data.pairings.length === 0}
    <div class="row">
      <div class="col-12">
        <div class="alert alert-info">
          <FontAwesomeIcon icon="info-circle" />
          You don't have any pairings in this tournament yet.
        </div>
      </div>
    </div>
  {:else}
    {#if data.pairings.length > 1}
      <div class="row">
        <div class="col-12">
          <button
            class="btn btn-link btn-sm p-0 mb-2 d-flex align-items-center small"
            onclick={() => (showPreviousRounds = !showPreviousRounds)}
          >
            <FontAwesomeIcon
              icon={showPreviousRounds ? "chevron-down" : "chevron-right"}
            />
            <span class="ml-2"
              >{showPreviousRounds ? "Hide" : "Show"} previous rounds</span
            >
          </button>
        </div>
      </div>
    {/if}

    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Table</th>
                {#if hasSideCol}
                  <th>Side</th>
                {/if}
                <th>Opponent</th>
                <th class="text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {#each data.pairings as pairing, idx (pairing.pairing_id)}
                {#if showPreviousRounds || idx === data.pairings.length - 1}
                  {@const mySide = getMySide(pairing)}
                  <tr>
                    <td>{getRoundLabel(pairing)}</td>
                    <td>{isBye(pairing) ? "" : (pairing.table_number ?? "")}</td
                    >
                    {#if hasSideCol}
                      <td>{isBye(pairing) ? "" : (mySide ?? "")}</td>
                    {/if}
                    <td>
                      {#if isBye(pairing)}
                        (Bye)
                      {:else}
                        <div>{pairing.opponent.name_with_pronouns}</div>
                        <div class="ids small text-muted">
                          {#if mySide}
                            {#if mySide === "Corp" && pairing.opponent.runner_identity}
                              <Identity
                                identity={{
                                  name: pairing.opponent.runner_identity,
                                  faction:
                                    pairing.opponent.runner_faction ?? "",
                                }}
                              />
                            {:else if mySide === "Runner" && pairing.opponent.corp_identity}
                              <Identity
                                identity={{
                                  name: pairing.opponent.corp_identity,
                                  faction: pairing.opponent.corp_faction ?? "",
                                }}
                              />
                            {/if}
                          {:else if pairing.opponent.corp_identity && pairing.opponent.runner_identity}
                            <Identity
                              identity={{
                                name: pairing.opponent.corp_identity,
                                faction: pairing.opponent.corp_faction ?? "",
                              }}
                            />
                            <Identity
                              identity={{
                                name: pairing.opponent.runner_identity,
                                faction: pairing.opponent.runner_faction ?? "",
                              }}
                            />
                          {/if}
                        </div>
                      {/if}
                    </td>
                    <td class="text-center">
                      {#if isBye(pairing)}
                        -
                      {:else if pairing.player_score !== null || pairing.opponent_score !== null}
                        {pairing.player_score ?? 0} - {pairing.opponent_score ??
                          0}
                      {/if}
                    </td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>
