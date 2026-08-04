<script lang="ts">
  import type { PageProps } from "./$types";
  import TournamentList from "../../TournamentList.svelte";

  let { data, params }: PageProps = $props();
</script>

<TournamentList
  typeId={params.typeId}
  tournamentsResponse={data.tournamentsResponse}
  tournamentTypes={data.tournamentTypes}
/>
