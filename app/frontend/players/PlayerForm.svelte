<script lang="ts">
  import { fade } from "svelte/transition";
  import type {
    Tournament,
    TournamentPolicies,
  } from "../pairings/PairingsData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { Player, savePlayer, deletePlayer as deletePlayerRequest, togglePlayerLock as togglePlayerLockRequest, dropPlayer as dropPlayerRequest } from "./PlayersData";

  const SaveState = Object.freeze({
    NONE: -1,
    UNSAVED: 0,
    SAVING: 1,
    SAVED: 2,
  });
  const FADE_DURATION = 1000;

  let {
    player,
    tournament,
    tournamentPolicies,
    savedCallback,
    droppedCallback,
    deletedCallback,
  }: {
    player: Player;
    tournament: Tournament;
    tournamentPolicies: TournamentPolicies;
    savedCallback?: (player: Player) => void;
    droppedCallback?: (player: Player) => void;
    deletedCallback?: (player: Player) => void;
  } = $props();

  let playerEdit = $derived($state.snapshot(player));
  let saveState: number = $state(SaveState.UNSAVED);

  async function togglePlayerLock() {
    const success = await togglePlayerLockRequest(tournament.id, playerEdit);
    if (!success) {
      return;
    }
    playerEdit.registration_locked = !playerEdit.registration_locked;

    savedCallback?.(playerEdit);
  }

  async function save() {
    if (
      playerEdit.id === 0 &&
      !tournament.registration_open &&
      !confirm("Tournament is closed, add new player anyway?")
    ) {
      return;
    }

    saveState = SaveState.SAVING;
    await savePlayer(tournament.id, playerEdit);
    savedCallback?.(playerEdit);
    saveState = SaveState.SAVED;

    setTimeout(() => {
      saveState = SaveState.NONE;
    }, 1);
    setTimeout(() => {
      saveState = SaveState.UNSAVED;
    }, FADE_DURATION);
  }

  async function dropPlayer() {
    const success = await dropPlayerRequest(tournament.id, playerEdit);
    if (!success) {
      return;
    }

    droppedCallback?.(playerEdit);
  }

  async function deletePlayer() {
    if (!confirm(`Are you sure you want to delete player "${playerEdit.name}"?`)) {
      return;
    }

    const success = await deletePlayerRequest(tournament.id, playerEdit);
    if (!success) {
      return;
    }

    deletedCallback?.(playerEdit);
  }
</script>

<div class="identities_form form-row">
  <!-- Name -->
  <div class="col">
    {#if playerEdit.id !== 0 && tournament.self_registration}
      <span class="text-info float-left mr-2" style="width: 12px">
        <FontAwesomeIcon icon={playerEdit.registration_locked ? "lock" : "unlock"} />
      </span>
    {/if}

    <label for="player_name_{playerEdit.id}">Name</label>
    <input
      id="player_name_{playerEdit.id}"
      type="text"
      class="form-control"
      placeholder="Enter player name"
      bind:value={playerEdit.name}
    />
  </div>

  <!-- Pronouns -->
  <div class="col-auto">
    <label for="player_name_{playerEdit.id}">Pronouns</label>
    <input
      id="player_name_{playerEdit.id}"
      type="text"
      class="form-control"
      placeholder="Example: they/them"
      bind:value={playerEdit.pronouns}
    />
  </div>

  <!-- Corp ID -->
  <div class="col">
    <label for="player_name_{playerEdit.id}">Corp ID</label>
    <input
      id="player_name_{playerEdit.id}"
      type="text"
      class="form-control corp_identities"
      placeholder="Example: they/them"
      readonly={tournament.nrdb_deck_registration}
      bind:value={playerEdit.corp_id.name}
    />
  </div>

  <!-- Runner ID -->
  <div class="col">
    <label for="player_name_{playerEdit.id}">Runner ID</label>
    <input
      id="player_name_{playerEdit.id}"
      type="text"
      class="form-control runner_identities"
      placeholder="Example: they/them"
      readonly={tournament.nrdb_deck_registration}
      bind:value={playerEdit.runner_id.name}
    />
  </div>
</div>

<div class="form-row mt-2">
  <!-- Streaming opt-out -->
  {#if tournament.allow_streaming_opt_out}
    <div class="col-auto form-check form-check-inline">
      <input id="player_include_in_stream_{playerEdit.id}" type="checkbox" class="form-check-input" bind:checked={playerEdit.include_in_stream} />
      <label for="player_include_in_stream_{playerEdit.id}" class="form-check-label">Video coverage allowed</label>
    </div>
  {/if}

  {#if tournamentPolicies.update}
    <!-- First round bye -->
    <div class="col-auto form-check form-check-inline">
      <input
        id="player_first_round_bye_{playerEdit.id}"
        type="checkbox"
        class="form-check-input"
        bind:checked={playerEdit.first_round_bye}
      />
      <label
        for="player_first_round_bye_{playerEdit.id}"
        class="form-check-label"
      >
        First Round Bye
      </label>
    </div>

    <!-- Manual seed -->
    {#if tournament.manual_seed}
      <div class="col-auto form-inline">
        <label for="player_seed_{playerEdit.id}">Manual Seed</label>
        <input
          id="player_seed_{playerEdit.id}"
          type="number"
          class="form-control ml-1"
          style="width: 6em"
          placeholder="Set seed"
          bind:value={playerEdit.manual_seed}
        />
      </div>
    {/if}
  {/if}

  <!-- Fixed table number -->
  <div class="col-auto form-inline">
    <label for="table_number_{playerEdit.id}">Fixed table number:</label>
    <input
      id="table_number_{playerEdit.id}"
      type="number"
      class="form-control ml-1"
      style="width: 6em"
      placeholder="Table number"
      bind:value={playerEdit.fixed_table_number}
    />
  </div>
</div>

<!-- Actions -->
<div class="text-right">
  <!-- Lock/unlock player -->
  {#if tournament.self_registration}
    <button type="button" class="btn btn-link text-info" onclick={togglePlayerLock}>
      {#if playerEdit.registration_locked}
        <FontAwesomeIcon icon="unlock" />
        Unlock player
      {:else}
        <FontAwesomeIcon icon="lock" />
        Lock player
      {/if}
    </button>
  {/if}

  <!-- View decks -->
  {#if tournament.nrdb_deck_registration}
    <a href={`/tournaments/${tournament.id}/players/${playerEdit.id}/registration`} class="btn btn-link text-info">
      <FontAwesomeIcon icon="eye" />
      View decks
    </a>
  {/if}
  
  <!-- Create/Save -->
  {#if playerEdit.id === 0}
    {#if saveState === SaveState.UNSAVED}
      <button type="button" class="btn btn-success" onclick={save}>
        <FontAwesomeIcon icon="plus" /> Create
      </button>
    {:else if saveState === SaveState.SAVING}
      <button type="button" class="btn btn-success">
        <span class="spinner-border spinner-border-sm m-auto"></span>
        Creating
      </button>
    {:else if saveState === SaveState.SAVED}
      <button
        type="button"
        class="btn btn-success"
        out:fade={{ duration: FADE_DURATION }}
      >
        <FontAwesomeIcon icon="check" /> Created
      </button>
    {/if}
  {:else if saveState === SaveState.UNSAVED}
    <button type="button" class="btn btn-success" onclick={save}>
      <FontAwesomeIcon icon="floppy-o" /> Save
    </button>
  {:else if saveState === SaveState.SAVING}
    <button type="button" class="btn btn-success">
      <span class="spinner-border spinner-border-sm m-auto"></span>
      Saving
    </button>
  {:else if saveState === SaveState.SAVED}
    <button
      type="button"
      class="btn btn-success"
      out:fade={{ duration: FADE_DURATION }}
    >
      <FontAwesomeIcon icon="check" /> Saved
    </button>
  {/if}

  {#if playerEdit.id !== 0}
    <!-- Drop -->
    <button type="button" class="btn btn-warning" onclick={dropPlayer}>
      <FontAwesomeIcon icon="arrow-down" /> Drop
    </button>

    <!-- Delete -->
    <button type="button" class="btn btn-danger" onclick={deletePlayer}>
      <FontAwesomeIcon icon="trash" /> Delete
    </button>
  {/if}
</div>
