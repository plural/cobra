<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { globalMessages } from "../utils/GlobalMessageState.svelte";

  export let typeId = "";
  export let userId: number | null = null;
  export let userName = "";

  interface TournamentInfo {
    id: string;
    attributes: {
      name: string;
      date: string;
      active_player_count: number;
      tournament_organizer: string;
      stream_url: string;
      tournament_type_id: number;
      user_id: number | null;
    };
  }

  interface TournamentTypeInfo {
    id: string;
    type: string;
    attributes: {
      name: string;
    };
  }

  interface TournamentsResponse {
    data: TournamentInfo[];
    included?: TournamentTypeInfo[];
  }

  let tournaments: TournamentInfo[] = [];
  let tournamentTypes: Record<string, string> = {};
  let loading = true;

  onMount(async () => {
    try {
      const response = await fetch(
        `/api/v1/public/tournaments?filter[tournament_type_id]=${typeId}&sort=-date,name&include=tournament_type`,
        {
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = (await response.json()) as TournamentsResponse;
      tournaments = data.data;

      if (data.included) {
        data.included.forEach((inc) => {
          if (inc.type === "tournament_types") {
            tournamentTypes[inc.id] = inc.attributes.name;
          }
        });
      }
    } catch (e) {
      const err = e as Error;
      globalMessages.errors.push(`Failed to load tournaments: ${err.message}`);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const dayStr = date.getDate();
    const monthStr = date.toLocaleString('default', { month: 'short' });
    const yearStr = date.getFullYear();
    return `${dayStr} ${monthStr} ${yearStr}`;
  }
</script>

<div>
  <GlobalMessages />

  <h1>Beta Tournaments By Type</h1>
  <p>Type ID: {typeId}</p>
  {#if userId !== null}
    <p>User: {userName} ({userId})</p>
  {/if}

  {#if loading}
    <p>Loading...</p>
  {:else if tournaments.length === 0}
    <p>No tournaments found for this type.</p>
  {:else}
    <div>
      {#each tournaments as tournament (tournament.id)}
        <div class="tournament card m-3">
          <div class="card-body">
            <h4 class="card-title">
              <a href={`/beta/tournaments/${tournament.id}`}>
                {tournament.attributes.name}
              </a>
              {#if tournament.attributes.tournament_type_id && tournamentTypes[tournament.attributes.tournament_type_id.toString()]}
                <span
                  style="font-size: .7em; position: relative; top: -.1em;"
                  class="badge badge-pill badge-secondary"
                >
                  {tournamentTypes[tournament.attributes.tournament_type_id.toString()]}
                </span>
              {/if}
            </h4>

            <h6 class="card-subtitle mb-2 text-muted">
              {#if tournament.attributes.date}
                {formatDate(tournament.attributes.date)} -
              {/if}
              {tournament.attributes.active_player_count == 1 ? "1 player" : `${tournament.attributes.active_player_count} players`}
              {#if tournament.attributes.tournament_organizer}
                - {tournament.attributes.tournament_organizer}
              {/if}
              {#if tournament.attributes.stream_url}
                - <i class="fa fa-video-camera"></i>
              {/if}
            </h6>

            {#if userId !== null && tournament.attributes.user_id === userId}
              <div class="delete_action">
                <a
                  href={`/tournaments/${tournament.id}`}
                  data-method="delete"
                  class="btn btn-danger"
                  data-confirm="Are you sure? This cannot be reversed."
                >
                  <i class="fa fa-trash-o"></i> Delete
                </a>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>