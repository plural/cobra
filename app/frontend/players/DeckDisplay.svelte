<script lang="ts">
  import Identity from "../identities/Identity.svelte";
  import type { Card, Deck } from "../utils/cards";

  let { deck, isCorp }: { deck: Deck | null; isCorp: boolean; } = $props();
  
  let cardTotal = $derived.by(() => {
    if (!deck) {
      return 0;
    }

    return deck.cards.reduce(
      (total, card) =>
        card.printing && !card.printing.card_type_id.endsWith("identity")
          ? total + card.count
          : total,
      0);
  });
  let influenceTotal = $derived.by(() => {
    if (!deck) {
      return 0;
    }

    return deck.cards.reduce(
      (total, card) =>
        card.printing?.influence_cost && card.printing.faction_id !== deck.identity?.printing?.faction_id
          ? total + (card.printing.influence_cost * card.count)
          : total,
      0);
  });

  function factionName(card: Card) {
    return card.printing ? card.printing.faction_id.replace("_", "-") : "";
  }
</script>

<!-- Deck summary -->
<table class="table table-bordered table-striped">
  <thead class="thead-dark">
    <tr>
      <th class="text-center deck-name-header">{isCorp ? "Corp Deck" : "Runner Deck"}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        {#if deck}
          {#if deck.name}
            {deck.name}
          {:else}
            Unnamed deck
          {/if}
        {:else}
          No deck selected
        {/if}
        <div class="float-right dontprint">
          <!-- TODO: Export dropdown menu -->
          <!-- TODO: Edit deck link -->
        </div>
      </td>
    </tr>
    <!-- TODO: Changes row -->
  </tbody>
</table>

{#if deck}
  <!-- Identity -->
  {#if deck.identity?.printing}
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
          <td class="text-center align-middle">{deck.identity.printing.minimum_deck_size}</td>
          <td>
            <!-- TODO: Edit in place? -->
            <!-- TODO: Card image -->
            <Identity identity={{ name: deck.identity.printing.title, faction: factionName(deck.identity) }} />
          </td>
          <td class="text-center align-middle">{deck.identity.printing.influence_limit}</td>
        </tr>
      </tbody>
    </table>
  {/if}
  
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
        {#if !card.printing?.card_type_id.endsWith("identity")}
          <tr>
            <td class="text-center align-middle">{card.count}</td>
            <td>
              <!-- TODO: Fix asset path -->
              <img src="/assets/images/types/{card.printing?.card_type_id}.jpg" alt={card.printing?.card_type_id} />
              <i class="fa icon icon-{factionName(card)} {factionName(card)}"></i>
              {card.printing?.title}
            </td>
            <td class="text-center align-middle">
              {#if card.printing?.influence_cost && card.printing.faction_id != deck.identity?.printing?.faction_id}
                {card.printing.influence_cost * card.count}
              {/if}
            </td>
          </tr>
        {/if}
      {/each}

      <!-- Totals -->
      <tr>
        <td class="text-center deck-side-column">{cardTotal}</td>
        <td class="text-center" style="color: #FFFFFF; background-color: #343A40;">Totals</td>
        <td class="text-center deck-side-column">{influenceTotal}</td>
      </tr>
    </tbody>
  </table>
{/if}
