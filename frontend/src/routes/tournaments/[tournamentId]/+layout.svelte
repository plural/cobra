<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import FontAwesomeIcon from "$lib/components/FontAwesomeIcon.svelte";
  import { resolve } from "$app/paths";
  import { authStore } from "$lib/utils/auth.svelte";

  let { children, data }: { children: Snippet; data: LayoutData; } = $props();

  let canEdit = $derived(data.tournament.user_id === authStore.user?.id);
  // TODO: Determine this properly
  let canDestroy = $derived(true);
</script>

<style>
  .stream-link {
    font-size: 2rem
  }
</style>

<div class="container">
  <!-- Tournament header -->
  <div class="row dontprint">
    <div class="col-md">
      <h1>{data.tournament.name}</h1>
    </div>
    <!-- TODO: Check if URL is valid? -->
    {#if data.tournament.stream_url}
      <div class="col-auto">
        <a href={data.tournament.stream_url} target="_blank" rel="external" class="stream-link">
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
    <!-- TODO: Set active class on all tabs -->
    
    <!-- TODO: Display if show? -->
    <li class="nav-item">
      <a href={resolve(`/tournaments/${data.tournament.id}`)} class="nav-link">
        <FontAwesomeIcon icon="trophy" /> Tournament
      </a>
    </li>
    <!-- TODO: Display if show? -->
    {#if data.player}
      <li class="nav-item">
        <a href={resolve(`/tournaments/${data.tournament.id}/my_tournament`)} class="nav-link">
          <FontAwesomeIcon icon="user" /> Me
        </a>
      </li>
    {/if}
    {#if canEdit}
      <li class="nav-item">
        <a href={resolve(`/tournaments/${data.tournament.id}/players`)} class="nav-link">
          <FontAwesomeIcon icon="users" /> Players
        </a>
      </li>
    {/if}
    <!-- TODO: Display If show? -->
    <li class="nav-item">
      <a href={resolve(`/tournaments/${data.tournament.id}/rounds`)} class="nav-link">
        <FontAwesomeIcon icon="calendar-check-o" /> Pairings
      </a>
    </li>
    <!-- TODO: Display if show? -->
    <li class="nav-item">
      <a href={resolve(`/tournaments/${data.tournament.id}/standings`)} class="nav-link">
        <FontAwesomeIcon icon="list-ol" /> Standings
      </a>
    </li>
    <!-- TODO: Display if show? and any elimination stages -->
    <li class="nav-item">
      <a href={resolve(`/tournaments/${data.tournament.id}/bracket`)} class="nav-link">
        <FontAwesomeIcon icon="sitemap" /> Bracket
      </a>
    </li>
    <!-- TODO: Display if show? -->
    <li class="nav-item">
      <a href={resolve(`/tournaments/${data.tournament.id}/stats`)} class="nav-link">
        <FontAwesomeIcon icon="pie-chart" /> Stats
      </a>
    </li>
    {#if canEdit}
      <li class="nav-item">
        <a href={resolve(`/tournaments/${data.tournament.id}/edit`)} class="nav-link">
          <FontAwesomeIcon icon="cog" /> Settings
        </a>
      </li>
    {/if}
    {#if canDestroy}
      <li class="nav-item">
        <a href={resolve(`/tournaments/${data.tournament.id}/danger_zone`)} class="nav-link">
          <FontAwesomeIcon icon="trash" /> Danger Zone
        </a>
      </li>
    {/if}
  </ul>
  
  <!-- Content -->
  <div class="row py-3 main-content">
    {@render children()}
  </div>
</div>
