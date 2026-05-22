<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadPlayer, loadTournament, Tournament } from "../tournaments/TournamentSettings";
  import { Player } from "./PlayersData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import ProgressButton from "../widgets/ProgressButton.svelte";
  import { type Card, type Deck, loadPrintings, type Printing } from "../utils/cards";
  import { savePlayer } from "../players/PlayersData";

  let {
    tournamentId,
    userId,
    decks,
  }: {
    tournamentId: number;
    userId: number;
    decks: Deck[];
  } = $props();

  const THE_CATALYST_NRDB_CODE = '30076'
  const THE_SYNDICATE_NRDB_CODE = '30077'

  let tournament: Tournament | undefined = $state();
  let player: Player = $state(new Player());
  let printings: Map<string, Printing> | null = $state(new Map<string, Printing>());

  onMount(async () => {
    // Load printings and hydrate decks
    const printingsResponse = await loadPrintings();
    if (printingsResponse) {
      printingsResponse.data.forEach((p) => printings.set(p.id, p.attributes));
      decks.forEach((deck: Deck) => {
        deck.cards.forEach((card: Card) => {
          card.printing = printings.get(card.id);
          if (card.printing?.card_type_id.endsWith("identity")) {
            deck.side_id = card.printing.side_id;
            deck.identity_printing_id = card.id;
            deck.identity_title = card.printing.title;
          }
        });
      });
    }

    [tournament, player] = await Promise.all([
      loadTournament(tournamentId),
      loadPlayer(tournamentId, userId)
    ]);
  });

  async function save() {
    player = await savePlayer(tournamentId, player);
    return true;
  }
</script>

<GlobalMessages />

{#if player.id !== 0 && tournament}
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

  <div class="row dontprint">
    <!-- Corp deck selection -->
    <div class="col-md-6">
      <div class="card">
        <ul class="list-group list-group-flush" style="border-bottom: 0;">
          <li class="list-group-item selected-deck">
            <div class="selected-deck-buttons"></div>
            <div class="selected-deck-identity" style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${THE_SYNDICATE_NRDB_CODE}.jpg)`}></div>
            <p class="mb-1">No corp selected</p>
          </li>
        </ul>
        <ul class="list-group list-group-flush overflow-auto" style="height: 24em;">
          {#each decks.filter((d) => d.side_id === "corp") as deck (deck.id)}
            <li class="list-group-item">
              <div class="deck-list-identity" style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${deck.identity_printing_id}.jpg)`}></div>
              <p class="mb-1">{deck.name}</p>
              <small>{deck.identity_title}</small>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Runner deck selection -->
    <div class="col-md-6">
      <div class="card">
        <ul class="list-group list-group-flush" style="border-bottom: 0;">
          <li class="list-group-item selected-deck">
            <div class="selected-deck-buttons"></div>
            <div class="selected-deck-identity" style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${THE_CATALYST_NRDB_CODE}.jpg)`}></div>
            <p class="mb-1">No runner selected</p>
          </li>
        </ul>
        <ul class="list-group list-group-flush overflow-auto" style="height: 24em;">
          {#each decks.filter((d) => d.side_id === "runner") as deck (deck.id)}
            <li class="list-group-item">
              <div class="deck-list-identity" style={`background-image:url(https://card-images.netrunnerdb.com/v2/small/${deck.identity_printing_id}.jpg)`}></div>
              <p class="mb-1">{deck.name}</p>
              <small>{deck.identity_title}</small>
            </li>
          {/each}
        </ul>
      </div>
    </div>
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
