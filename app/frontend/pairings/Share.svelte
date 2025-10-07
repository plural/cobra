<script lang="ts">
  import { onMount } from "svelte";
  import { SharingData } from "./PairingsData";
  import { loadSharingData } from "./PairingsData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  interface Props {
    tournamentId: number;
    roundId: number;
  }

  let { tournamentId, roundId }: Props = $props();

  let data = $state(new SharingData());
  let error = $state("");

  onMount(async () => {
    data = await loadSharingData(tournamentId, roundId);
  });

  async function copyMarkdown(e: MouseEvent, markdown: string) {
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      error = "Unable to copy text.";
    }
  }
</script>

<p>
  <a href="/tournaments/{tournamentId}/rounds" class="btn btn-primary">
    <FontAwesomeIcon icon="arrow-left" /> Back to Pairings
  </a>
</p>

{#if data}
  <h2>Share Pairings to Discord</h2>

  {#if error}
    <div class="alert alert-danger">{error}</div>
  {/if}

  {#each data.pages as page, i (i)}
    <div class="mb-3">
      {#if data.pages.length > 1}
        <h3>Page {i + 1}</h3>
      {/if}
      <textarea readonly={true}>{page}</textarea>
      <button
        onclick={(e) => {
          void copyMarkdown(e, page);
        }}
        class="btn btn-info align-top"
        ><FontAwesomeIcon icon="copy" /> Copy</button
      >
    </div>
  {/each}
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
