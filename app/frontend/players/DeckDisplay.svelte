<script lang="ts">
  import Identity from "../identities/Identity.svelte";
  import { deckCsv, type Card, type Deck } from "../utils/decks.svelte";
  import { downloadBlob } from "../utils/files";
  import { getCardTypeImage } from "../utils/images";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  let { deck, isCorp }: { deck: Deck | null; isCorp: boolean } = $props();

  let cardTotal = $derived.by(() => {
    if (!deck) {
      return 0;
    }

    return deck.cards
      .filter((card: Card) => !card.card_type_id.endsWith("identity"))
      .reduce((total: number, card: Card) => total + card.quantity, 0);
  });
  let influenceTotal = $derived.by(() => {
    if (!deck) {
      return 0;
    }

    return deck.cards
      .filter((card: Card) => card.faction_id !== deck.details.faction_id)
      .reduce((total: number, card: Card) => total + card.influence, 0);
  });

  function adjustFactionId(factionId: string) {
    return factionId.replace("_", "-");
  }

  async function copyToClipboard() {
    if (!deck) {
      return;
    }

    await navigator.clipboard.writeText(
      deck.cards.reduce(
        (text: string, card: Card) => `${text}${card.quantity} ${card.title}\n`,
        "",
      ),
    );
    alert("Copied to clipboard");
  }

  function downloadCsv() {
    if (!deck) {
      return;
    }

    downloadBlob(
      `${deck.details.player_name} - ${deck.details.name}.csv`,
      new Blob([deckCsv([deck])], { type: "text/csv" }),
    );
  }
</script>

<!-- Deck summary -->
<table class="table table-bordered table-striped">
  <thead class="thead-dark">
    <tr>
      <th class="text-center deck-name-header">
        {isCorp ? "Corp Deck" : "Runner Deck"}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        {#if deck && deck.details.id !== 0}
          {#if deck.details.name}
            {deck.details.name}
            <div class="float-right dontprint">
              <span class="dropdown">
                <button
                  type="button"
                  title="Export deck"
                  class="btn btn-link p-0"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon="download" />
                </button>
                <div class="dropdown-menu">
                  <button
                    type="button"
                    class="dropdown-item"
                    onclick={copyToClipboard}
                  >
                    Copy to clipboard in NetrunnerDB format
                  </button>
                  <button
                    type="button"
                    class="dropdown-item"
                    onclick={downloadCsv}
                  >
                    Download as a CSV spreadsheet
                  </button>
                </div>
              </span>
              {#if deck.details.mine}
                <a
                  href="https://netrunnerdb.com/en/deck/edit/{deck.details
                    .nrdb_uuid}"
                  target="_blank"
                  title="Edit Deck"
                  class="ml-2"
                >
                  <FontAwesomeIcon icon="external-link" />
                </a>
              {/if}
            </div>
          {:else}
            Unnamed deck
          {/if}
        {:else}
          No deck selected
        {/if}
      </td>
    </tr>
  </tbody>
</table>

{#if deck && deck.details.id !== 0}
  <!-- Identity -->
  <table class="table table-bordered table-striped">
    <thead class="thead-dark">
      <tr>
        <th class="text-center deck-side-column">Min</th>
        <th class="text-center">Identity</th>
        <th class="text-center deck-side-column">Max</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center align-middle">{deck.details.min_deck_size}</td>
        <td>
          <Identity
            identity={{
              name: deck.details.identity_title ?? "",
              faction: adjustFactionId(deck.details.faction_id ?? ""),
            }}
          />
        </td>
        <td class="text-center align-middle">{deck.details.max_influence}</td>
      </tr>
    </tbody>
  </table>

  <!-- Deck list -->
  <table class="table table-bordered table-striped">
    <thead class="thead-dark">
      <tr>
        <th class="text-center deck-side-column">Qty</th>
        <th class="text-center">Card Name</th>
        <th class="text-center deck-side-column">Inf</th>
      </tr>
    </thead>
    <tbody>
      <!-- Cards -->
      {#each deck.cards as card (card.id)}
        <tr>
          <td class="text-center align-middle">{card.quantity}</td>
          <td>
            <img
              src={getCardTypeImage(card.card_type_id)}
              alt={card.card_type_id}
            />
            <i
              class="fa icon icon-{adjustFactionId(
                card.faction_id,
              )} {adjustFactionId(card.faction_id)}"
            ></i>
            {card.title}
          </td>
          <td class="text-center align-middle">
            {#if card.influence_cost && card.faction_id != deck.details.faction_id}
              {card.influence_cost * card.quantity}
            {/if}
          </td>
        </tr>
      {/each}

      <!-- Totals -->
      <tr>
        <td class="text-center deck-side-column">{cardTotal}</td>
        <td
          class="text-center"
          style="color: #FFFFFF; background-color: #343A40;"
        >
          Totals
        </td>
        <td class="text-center deck-side-column">{influenceTotal}</td>
      </tr>
    </tbody>
  </table>
{/if}
