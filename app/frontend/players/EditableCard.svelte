<script lang="ts">
  import Svelecte from "svelecte";
  import type { Printing, PrintingsResponse } from "../lib/api_types";
  import type { Snippet } from "svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  interface CardSearchOption {
    label: string;
    value: Printing;
  }

  let {
    sideId,
    allowEdit,
    isIdentity,
    onChange,
    children
  }: {
    sideId: string;
    allowEdit: boolean;
    isIdentity: boolean;
    onChange: (printing: Printing) => void;
    children: Snippet;
  } = $props();

  let editing = $state(false);

  function getCardSearchUrl(sideId: string | null) {
    const searchString = `[query] ${isIdentity ? "t:identity" : "t!identity"}`;
    return `https://api.netrunnerdb.com/api/v3/public/printings?fields[printings]=card_id,card_type_id,title,side_id,faction_id,minimum_deck_size,influence_limit,influence_cost&filter[side_id]=${sideId}&filter[distinct_cards]=true&filter[search]=${searchString}`;
  }

  function transformCardLookup(response: PrintingsResponse) {
    return response.data.map((p) => { return { label: p.attributes.title, value: p }; });
  }

  function sveleteOnChange(selection: CardSearchOption | null) {
    if (!selection?.value.id) {
      return;
    }

    onChange(selection.value);

    editing = false;
  }
</script>

{#if editing}
  <button
    type="button"
    title="Add"
    class="btn btn-link p-0 float-right"
    onclick={() => editing = false}
  >
    <FontAwesomeIcon icon="close" />
  </button>
  <div>
    <Svelecte
      controlClass="form-control"
      placeholder="Enter identity name"
      fetch={getCardSearchUrl(sideId)}
      fetchCallback={transformCardLookup}
      labelField="label"
      valueField="value"
      onChange={sveleteOnChange}
    />
  </div>
{:else}
  <div>
    {#if allowEdit}
      <button
        type="button"
        title="Add"
        class="btn btn-link p-0 float-right"
        onclick={() => editing = true}
      >
        <FontAwesomeIcon icon="pencil" />
      </button>
    {/if}

    {@render children()}
  </div>
{/if}
