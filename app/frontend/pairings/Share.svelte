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

  onMount(async () => {
    data = await loadSharingData(tournamentId, roundId);
  });

  function copyMarkdown(e: MouseEvent, markdown: string) {
    e.preventDefault();
    
    try {
      navigator.clipboard.writeText(markdown);
    } catch (err) {
      // TODO: Notify user
    }
  }
</script>

<p>
  <a href="/tournaments/{tournamentId}/rounds" class="btn btn-primary">
    <FontAwesomeIcon icon="arrow-left" /> Back to Pairings
  </a>
</p>

{#if data}
  <div>
    <textarea readonly={true}>{data.markdown}</textarea>
    <button onclick={(e) => { copyMarkdown(e, data.markdown) }} class="btn btn-info align-top"><FontAwesomeIcon icon="copy" /> Copy</button>
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
