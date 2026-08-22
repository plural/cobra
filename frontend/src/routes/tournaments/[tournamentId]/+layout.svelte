<script lang="ts">
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import FontAwesomeIcon from "$lib/components/FontAwesomeIcon.svelte";
  import { resolve } from "$app/paths";
  import { authStore } from "$lib/utils/auth.svelte";

  let { children, data }: { children: Snippet; data: LayoutData; } = $props();

  let tournament = $derived(data.tournamentData.tournament);
  let canEdit = $derived(tournament.user_id === authStore.user?.id);
  let streamUrl = $derived.by(() => {
    try {
      const url = new URL(tournament.stream_url);
      return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
    } catch {
      return "";
    }
  });
</script>

<style>
  .stream-link {
    font-size: 2rem
  }
</style>

<!-- Tournament header -->
<div class="row dontprint">
  <div class="col-md">
    <h1>{tournament.name}</h1>
  </div>
  {#if streamUrl}
    <div class="col-auto">
      <a href={streamUrl} target="_blank" rel="external" class="stream-link">
        <FontAwesomeIcon icon="video-camera" />
      </a>
    </div>
  {/if}
  <div class="col col-md-auto mb-md-0 mb-2">
    <!-- TODO: Round timer -->
  </div>
</div>

<!-- Tabs -->
<ul class="nav nav-tabs dontprint">
  <li class="nav-item">
    <a
      href={resolve(`/tournaments/${tournament.id}`)}
      class="nav-link"
      class:active={page.route.id === "/tournaments/[tournamentId]"}
    >
      <FontAwesomeIcon icon="trophy" /> Tournament
    </a>
  </li>
  
  <!-- TODO: Remove the 'as string' casts throughout once the route id exists. -->
  {#if data.player}
    <li class="nav-item">
    <a
      href={resolve(`/tournaments/${tournament.id}/my_tournament`)}
      class="nav-link"
      class:active={page.route.id as string === "/tournaments/[tournamentId]/my_tournament"}
    >
        <FontAwesomeIcon icon="user" /> Me
      </a>
    </li>
  {/if}
  {#if canEdit}
    <li class="nav-item">
      <a
        href={resolve(`/tournaments/${tournament.id}/players`)}
        class="nav-link"
        class:active={page.route.id as string === "/tournaments/[tournamentId]/players"}
      >
        <FontAwesomeIcon icon="users" /> Players
      </a>
    </li>
  {/if}
  <li class="nav-item">
    <a
      href={resolve(`/tournaments/${tournament.id}/rounds`)}
      class="nav-link"
      class:active={page.route.id as string === "/tournaments/[tournamentId]/rounds"}
    >
      <FontAwesomeIcon icon="calendar-check-o" /> Pairings
    </a>
  </li>
  <li class="nav-item">
    <a
      href={resolve(`/tournaments/${tournament.id}/players/standings`)}
      class="nav-link"
      class:active={page.route.id as string === "/tournaments/[tournamentId]/players/standings"}
    >
      <FontAwesomeIcon icon="list-ol" /> Standings
    </a>
  </li>
  <!-- TODO: Display if there is an elimination stage. -->
  <li class="nav-item">
    <a
      href={resolve(`/tournaments/${tournament.id}/bracket`)}
      class="nav-link"
      class:active={page.route.id as string === "/tournaments/[tournamentId]/bracket"}
    >
      <FontAwesomeIcon icon="sitemap" /> Bracket
    </a>
  </li>
  <li class="nav-item">
    <a
      href={resolve(`/tournaments/${tournament.id}/stats`)}
      class="nav-link"
      class:active={page.route.id as string === "/tournaments/[tournamentId]/stats"}
    >
      <FontAwesomeIcon icon="pie-chart" /> Stats
    </a>
  </li>
  {#if canEdit}
    <li class="nav-item">
      <a
        href={resolve(`/tournaments/${tournament.id}/edit`)}
        class="nav-link"
        class:active={page.route.id as string === "/tournaments/[tournamentId]/edit"}
      >
        <FontAwesomeIcon icon="cog" /> Settings
      </a>
    </li>
  {/if}
  {#if canEdit}
    <li class="nav-item">
      <a
        href={resolve(`/tournaments/${tournament.id}/danger_zone`)}
        class="nav-link"
        class:active={page.route.id as string === "/tournaments/[tournamentId]/danger_zone"}
      >
        <FontAwesomeIcon icon="trash" /> Danger Zone
      </a>
    </li>
  {/if}
</ul>

<!-- Content -->
<div class="row py-3 main-content">
  {@render children()}
</div>
