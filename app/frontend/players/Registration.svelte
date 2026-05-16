<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadPlayer, loadTournament, Tournament } from "../tournaments/TournamentSettings";
  import { Player } from "./PlayersData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import ProgressButton from "../widgets/ProgressButton.svelte";

  let {
    tournamentId,
    userId,
  }: {
    tournamentId: number;
    userId: number;
  } = $props();

  let tournament: Tournament | undefined = $state();
  let player: Player | undefined = $state();

  onMount(async () => {
    tournament = await loadTournament(tournamentId);
    player = await loadPlayer(tournamentId, userId);
    // TODO: Load decks
  });

  async function save() {
    // TODO
    return true;
  }
</script>

<GlobalMessages />

{#if player && tournament}
  <div class="card mb-3">
    <div class="card-header">
      <h5>My Registration Information</h5>
    </div>

    <div class="card-body">
      <div class="identities_form form-row">
        <!-- Name -->
        <div class="col-4">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter player name"
            bind:value={player.name}
          />
        </div>
      
        <!-- Pronouns -->
        <div class="col-4">
          <label for="pronouns">Pronouns</label>
          <input
            id="pronouns"
            type="text"
            class="form-control"
            placeholder="Example: they/them"
            bind:value={player.pronouns}
          />
        </div>
      </div>

      <div class="form-row mt-2">
        <!-- Streaming opt-out -->
        {#if tournament.allow_streaming_opt_out}
          <div class="col-4 form-check form-check-inline">
            <input
              id="include_in_stream"
              type="checkbox"
              class="form-check-input"
              bind:checked={player.include_in_stream}
            />
            <label for="include_in_stream" class="form-check-label">
              Video coverage allowed
            </label>
          </div>
        {/if}
      </div>

      <div class="text-right">
        <!-- Create/Save -->
        <ProgressButton
          css="btn btn-success"
          inProgressText="Saving"
          completeText="Saved"
          onclick={save}
        >
          <FontAwesomeIcon icon="floppy-o" /> Save
        </ProgressButton>
      </div>
    </div>
  </div>

  <div class="alert alert-danger dontprint">
    <FontAwesomeIcon icon="exclamation-triangle" /> Deck legality is not yet checked. Please ensure your decks are legal.
  </div>

  <div class="alert alert-secondary dontprint">
    Please select from your decks below. <a href="https://netrunnerdb.com/en/decks" target="_blank">See your decks in NetrunnerDB</a>. Refresh the page to reload from NetrunnerDB.
  </div>

  <div class="dontprint">
    <!-- TODO: Corp deck selection -->

    <!-- TODO: Runner deck selection -->
  </div>

  <div>
    <!-- TODO: Corp deck display -->

    <!-- TODO: Runner deck display -->
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
