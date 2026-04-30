<script lang="ts">
  import Identity from "../identities/Identity.svelte";
  import type { Tournament } from "../tournaments/TournamentSettings";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import IdentitySelect from "../widgets/IdentitySelect.svelte";
  import { Player, savePlayer as savePlayerRequest } from "./PlayersData";
    import {
    loadIdentityNames,
    type IdentityNames,
  } from "../identities/Identity";
    import { onMount } from "svelte";

  let {
    userId,
    tournament,
    player = new Player(),
  }: {
    userId: number,
    tournament: Tournament,
    player?: Player,
  } = $props();

  let identityNames: IdentityNames | undefined = $state();
  let playerAgreed = $state(false);
  // svelte-ignore state_referenced_locally
  let readOnly = $state(player.id !== 0);

  onMount(async() => {
    identityNames = await loadIdentityNames();
  });

  async function savePlayer() {
    player = await savePlayerRequest(tournament.id, player);
    readOnly = true;
  }
</script>

{#if readOnly}
  <div class="card">
    <div class="card-header d-flex justify-content-between">
      <h5 class="mb-0">My Registration Information</h5>
      <!-- TODO: If deck registration is enabled, then this should go to the deck registration page -->
        <!-- TODO: Can players change their non-deck info if deck registration is enabled? -->
      
      {#if tournament.nrdb_deck_registration}
        <a href={`/tournaments/${tournament.id}/registration`}>
          <FontAwesomeIcon icon="edit" />
          Edit
        </a>
      {:else}
        <button type="button" class="btn btn-link text-info p-0" onclick={() => { readOnly = false; }}>
          <FontAwesomeIcon icon="edit" />
          Edit
        </button>
      {/if}
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <div class="small text-secondary">Name:</div>
        <div aria-label="name">
          {player.name_with_pronouns}
        </div>
      </li>
      <li class="list-group-item">
        <div class="small text-secondary">Corp ID:</div>
        <div aria-label="corp ID">
          <Identity
            identity={player.corp_id}
            name_if_missing="Unspecified"
            icon_if_missing="interrupt"
          />
        </div>
      </li>
      <li class="list-group-item">
        <div class="small text-secondary">Runner ID:</div>
        <div aria-label="runner ID">
          <Identity
            identity={player.runner_id}
            name_if_missing="Unspecified"
            icon_if_missing="interrupt"
          />
        </div>
      </li>
      <li class="list-group-item">
        <div class="small text-secondary">First Round Bye:</div>
        {#if player.first_round_bye}
          <div
            class="badge badge-success"
            aria-label="first round bye"
          >
            YES
          </div>
        {:else}
          <div
            class="badge badge-secondary"
            aria-label="first round bye"
          >
            NO
          </div>
        {/if}
      </li>
      <li class="list-group-item">
        <div class="small text-secondary">Stream my games:</div>
        {#if player.include_in_stream}
          <div
            class="badge badge-success"
            aria-label="stream my games"
          >
            YES
          </div>
        {:else}
          <div
            class="badge badge-secondary"
            aria-label="stream my games"
          >
            NO
          </div>
        {/if}
      </li>
    </ul>
  </div>
{:else}
  <div class="card alert alert-secondary">
    <div class="card-header d-flex justify-content-between">
      <h5 class="mb-0">
        {#if player.id === 0}
          Register for this Event
        {:else}
          My Registration Information
        {/if}
      </h5>
      
      {#if player.id !== 0}
        <button type="button" class="btn btn-link text-info p-0" onclick={() => { readOnly = true; }}>
          <FontAwesomeIcon icon="undo" />
          Cancel
        </button>
      {/if}
    </div>

    <div class="identities_form d-block">
      <div class="form-group">
        <label class="d-block" for="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          class="form-control"
          bind:value={player.name}
        />
      </div>

      <div class="form-group">
        <label class="d-block" for="pronouns">Pronouns</label>
        <input
          id="pronouns"
          type="text"
          placeholder="Example: they/them"
          class="form-control"
          bind:value={player.pronouns}
        />
      </div>

      {#if !tournament.nrdb_deck_registration}
        <div class="form-group">
          <label class="d-block" for="corp-identity">Corp ID</label>
          <IdentitySelect
            id="corp-identity"
            placeholder="Search for corp ID"
            identityNames={identityNames ? identityNames.corp : []}
            bind:value={player.corp_id.name}
          />
        </div>

        <div class="form-group">
          <label class="d-block" for="runner-identity">
            Runner ID
          </label>
          <IdentitySelect
            id="runner-identity"
            placeholder="Search for runner ID"
            identityNames={identityNames
              ? identityNames.runner
              : []}
            bind:value={player.runner_id.name}
          />
        </div>
      {/if}

      {#if tournament.allow_streaming_opt_out}
        <div class="form-group">
          <label for="include_in_stream">
            Should we include your games in video coverage of this
            event? Note: During a top cut it may not be possible to
            exclude you from coverage.
          </label>
          <input
            id="include_in_stream"
            type="checkbox"
            bind:checked={player.include_in_stream}
          />
          <label for="include_in_stream">
            Include my games in video coverage
          </label>
        </div>
      {/if}

      {#if userId === tournament.user_id}
        <input
          id="first_round_bye"
          type="checkbox"
          bind:checked={player.first_round_bye}
        />
        <label for="first_round_bye">First Round Bye</label>

        {#if tournament.manual_seed}
          <label class="d-block" for="manual_seed">
            Manual Seed
          </label>
          <input
            id="manual_seed"
            type="number"
            placeholder="Set seed"
            class="form-control"
            bind:value={player.manual_seed}
          />
        {/if}
      {/if}

      {#if player.id === 0}
        <hr />

        <div class="form-group">
          <label for="consent_data_sharing">
            Your name, pronouns and Netrunner deck identities will be
            publicly visible on this website. If you submit decklists
            they will be shared with the organiser. If you enter a
            round with open decklists, they may be shared with
            participants or made public.
          </label>
          <input
            id="consent_data_sharing"
            type="checkbox"
            bind:checked={playerAgreed}
          />
          <label for="consent_data_sharing">
            I agree to these terms
          </label>
        </div>
      {/if}
    </div>

    <div class="text-right">
      <button
        type="button"
        class="btn btn-primary"
        disabled={player.id === 0 && !playerAgreed}
        onclick={savePlayer}
      >
        <FontAwesomeIcon icon="user-plus" />
        {#if player.id !== 0}
          Submit
        {:else if tournament.nrdb_deck_registration}
          Deck Registration
        {:else}
          Register
        {/if}
      </button>
    </div>
  </div>
{/if}