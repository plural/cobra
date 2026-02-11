<script lang="ts">
  import { onMount } from "svelte";
  import { SharingData } from "./PairingsData";
  import { loadSharingData } from "./PairingsData";
  import SharePage from "./SharePage.svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  interface Props {
    tournamentId: number;
    roundId: number;
  }

  let { tournamentId, roundId }: Props = $props();

  let data = $state(new SharingData());
  let betaEnabledCookie: CookieListItem | null = $state(null);

  onMount(async () => {
    data = await loadSharingData(tournamentId, roundId);
    betaEnabledCookie = await cookieStore.get("beta_enabled");
  });
</script>

<p>
  <a
    href={betaEnabledCookie?.value === "true"
      ? `/beta/tournaments/${tournamentId}/rounds`
      : `/tournaments/${tournamentId}/rounds`}
    class="btn btn-primary"
  >
    <FontAwesomeIcon icon="arrow-left" /> Back to Pairings
  </a>
</p>

{#if data}
  <h2>Export Pairings as Markdown</h2>

  {#each data.pages as text, i (i)}
    <div class="mb-3">
      <SharePage {text} page={i + 1} />
    </div>
  {/each}
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
