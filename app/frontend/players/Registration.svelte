<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import {
    loadPlayer,
    loadTournament,
    Tournament,
  } from "../tournaments/TournamentSettings";
  import { Player } from "./PlayersData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import ProgressButton from "../widgets/ProgressButton.svelte";
  import {
    type NrdbDeck,
    Deck,
    convertNrdbDeck,
    getPrintings,
  } from "../utils/decks.svelte";
  import { loadDecks, savePlayer } from "../players/PlayersData";
  import DeckDisplay from "./DeckDisplay.svelte";

  let {
    tournamentId,
    playerId,
    nrdbDecks,
  }: {
    tournamentId: number;
    playerId: number;
    nrdbDecks: NrdbDeck[];
  } = $props();

  const THE_CATALYST_NRDB_CODE = "30076";
  const THE_SYNDICATE_NRDB_CODE = "30077";

  let tournament = $state<Tournament | undefined>();
  let player = $state<Player | null>(null);
  let decks = $state<Deck[] | null>(null);
  let tournamentDecks = $state<Deck[]>();
  let selectedCorpDeck = $state(new Deck());
  let selectedRunnerDeck = $state(new Deck());
  let editMode = $state(new URLSearchParams(document.location.search).get("edit") === "true");
  let editing = $state(false);

  onMount(async () => {
    [tournament, player] = await Promise.all([
      loadTournament(tournamentId),
      loadPlayer(tournamentId, playerId),
    ]);

    // Load printings and hydrate decks
    const loadedDecks: Deck[] = [];
    if (nrdbDecks.length > 0) {
      const printings = await getPrintings();
      if (printings.size > 0) {
        nrdbDecks.forEach((nrdbDeck: NrdbDeck) => {
          const deck = convertNrdbDeck(nrdbDeck, printings);
          deck.cards.sort((a, b) => {
            if (a.card_type_id != b.card_type_id) {
              return a.card_type_id < b.card_type_id ? -1 : 1;
            }

            if (a.title !== b.title) {
              return a.title < b.title ? -1 : 1;
            }

            return 0;
          });

          loadedDecks.push(deck);
        });
      }
    }

    if (player) {
      tournamentDecks = await loadDecks(tournamentId, player.id);
      selectedCorpDeck = tournamentDecks.find(((d) => d.details.side_id === "corp")) ?? new Deck();
      selectedRunnerDeck = tournamentDecks.find(((d) => d.details.side_id === "runner")) ?? new Deck();
    }
    decks = loadedDecks;
  });

  function toggleEditing() {
    // TODO: Update edit mode for DeckDisplay components
    editing = !editing;

    // TODO: Do the following:
    // - Create edit copies of selected decks
    // - Reset edit copies if edit mode is cancelled
  }

  async function save() {
    if (player) {
      player.corp_deck = selectedCorpDeck ?? undefined;
      player.runner_deck = selectedRunnerDeck ?? undefined;
      player = await savePlayer(tournamentId, player);
    }
    return true;
  }

  function selectDeck(deck: Deck, isCorp: boolean) {
    if (isCorp) {
      selectedCorpDeck =
        deck && deck.details.nrdb_uuid === selectedCorpDeck?.details.nrdb_uuid
          ? new Deck()
          : deck;
    } else {
      selectedRunnerDeck =
        deck && deck.details.nrdb_uuid === selectedRunnerDeck?.details.nrdb_uuid
          ? new Deck()
          : deck;
    }
  }
</script>

<GlobalMessages />

{#snippet deckListItem(deck: Deck, isCorp: boolean)}
  <button
    class="list-group-item list-group-item-action {deck.details.nrdb_uuid ===
    (isCorp
      ? selectedCorpDeck?.details.nrdb_uuid
      : selectedRunnerDeck?.details.nrdb_uuid)
      ? 'active'
      : ''}"
    onclick={() => {
      selectDeck(deck, isCorp);
    }}
  >
    <div
      class="deck-list-identity"
      style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${deck.details.identity_nrdb_printing_id}.jpg)`}
    ></div>
    <p class="mb-1">{deck.details.name}</p>
    <small>{deck.details.identity_title}</small>
  </button>
{/snippet}

{#snippet decksList(isCorp: boolean, selectedDeck: Deck | null)}
  {#if decks !== null}
    <ul class="list-group list-group-flush" style="border-bottom: 0;">
      <li class="list-group-item selected-deck">
        <div class="selected-deck-buttons">
          <!-- TODO: Undo -->
          {#if selectedDeck}
            <button
              type="button"
              title="Deselect"
              class="btn btn-link p-0"
              onclick={() => {
                selectDeck(new Deck(), isCorp);
              }}
            >
              <FontAwesomeIcon icon="close" />
            </button>
          {/if}
        </div>
        {#if selectedDeck}
          <div
            class="selected-deck-identity"
            style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${selectedDeck.details.identity_nrdb_printing_id}.jpg)`}
          ></div>
          <p class="mb-1">{selectedDeck.details.name}</p>
        {:else}
          <div
            class="selected-deck-identity"
            style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${isCorp ? THE_SYNDICATE_NRDB_CODE : THE_CATALYST_NRDB_CODE}.jpg)`}
          ></div>
          <p class="mb-1">{isCorp ? "No corp selected" : "No runner selected"}</p>
        {/if}
      </li>
    </ul>
    <ul class="list-group list-group-flush overflow-auto" style="height: 24em;">
      {#each decks.filter((d) => d.details.side_id === (isCorp ? "corp" : "runner")) as deck (deck.details.id)}
        <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
        {@render deckListItem(deck, isCorp)}
      {/each}
    </ul>
  {/if}
{/snippet}

{#if player && player.id !== 0 && tournament}
  <div class="card mb-3">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <h5 class="mb-0">My Registration Information</h5>
        <span class="float-right dontprint">
          <button type="button" class="btn btn-link p-0 mr-3" title="Print" onclick={() => { window.print(); }}>
            <FontAwesomeIcon icon="print" />
          </button>
          <a href={editMode
            ? `/beta/tournaments/${tournamentId}/rounds`
            : `/beta/tournaments/${tournamentId}`}
            class="btn btn-link p-0"
            title="Cancel"
          >
            <FontAwesomeIcon icon="undo" />
          </a>
        </span>
      </div>
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

      <div class="dontprint mt-sm-2">
        {#if editMode}
          <div class="float-left">
            {#if editing}
              <button type="button" class="btn btn-link" onclick={toggleEditing}>
                <FontAwesomeIcon icon="undo" />
                Cancel edits
              </button>
            {:else}
              <a href="/beta/tournaments/{tournamentId}/registration" class="btn btn-link">
                <FontAwesomeIcon icon="edit" />
                Choose decks from your NetrunnerDB account
              </a>
              <button type="button" class="btn btn-link" onclick={toggleEditing}>
                <FontAwesomeIcon icon="edit" />
                Edit decks in place
              </button>
            {/if}
          </div>
        {/if}

        <div class="float-right">
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
  </div>

  <div class="alert alert-danger dontprint">
    <FontAwesomeIcon icon="exclamation-triangle" /> Deck legality is not yet checked.
    Please ensure your decks are legal.
  </div>

  {#if !editMode}
    <div class="alert alert-secondary dontprint">
      Please select from your decks below. <a
        href="https://netrunnerdb.com/en/decks"
        target="_blank">See your decks in NetrunnerDB</a
      >. Refresh the page to reload from NetrunnerDB.
    </div>

    <div class="row mb-3 justify-content-center dontprint">
      {#if decks !== null}
        <!-- Corp deck selection -->
        <div class="col-md-6">
          <div class="card">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render decksList(true, selectedCorpDeck)}
          </div>
        </div>

        <!-- Runner deck selection -->
        <div class="col-md-6">
          <div class="card">
            <!-- eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -->
            {@render decksList(false, selectedRunnerDeck)}
          </div>
        </div>
      {:else}
        <div class="spinner-border m-auto"></div>
      {/if}
    </div>
  {/if}

  {#if selectedCorpDeck && selectedRunnerDeck}
    <div class="row">
      <div class="col-md-6">
        <DeckDisplay bind:deck={selectedCorpDeck} isCorp={true} editMode={editing} />
      </div>

      <div class="col-md-6">
        <DeckDisplay bind:deck={selectedRunnerDeck} isCorp={false} editMode={editing} />
      </div>
    </div>
  {:else}
    <div class="d-flex align-items-center m-2">
      <div class="spinner-border m-auto"></div>
    </div>
  {/if}
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
