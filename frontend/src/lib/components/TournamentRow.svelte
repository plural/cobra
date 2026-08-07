<script lang="ts">
  import { COBRA_API_SERVER } from "$app/env/public";
  import type { TournamentInfo } from "$lib/utils/api_types";

  let {
    tournament,
    tournamentTypeName = null,
  }: {
    tournament: TournamentInfo;
    tournamentTypeName?: string | null;
  } = $props();
</script>

<div class="tournament card m-3">
  <div class="card-body">
    <h4 class="card-title">
      <a href="{COBRA_API_SERVER}/beta/tournaments/{tournament.id}" rel="external">
        {tournament.attributes.name}
      </a>
      {#if tournamentTypeName}
        <span
          style="font-size: .7em; position: relative; top: -.1em;"
          class="badge badge-pill badge-secondary"
        >
          {tournamentTypeName}
        </span>
      {/if}
    </h4>

    <h6 class="card-subtitle mb-2 text-muted">
      {#if tournament.attributes.date}
        {new Date(tournament.attributes.date).toLocaleString(navigator.languages, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })} -
      {/if}
      {tournament.attributes.active_player_count}
      {new Intl.PluralRules(navigator.languages).select(
        tournament.attributes.active_player_count,
      ) == "one"
        ? "active player"
        : "active players"}
      {#if tournament.attributes.tournament_organizer}
        - {tournament.attributes.tournament_organizer}
      {/if}
      {#if tournament.attributes.stream_url}
        - <i class="fa fa-video-camera"></i>
      {/if}
    </h6>
  </div>
</div>
