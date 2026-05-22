<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import PagingRow from "../widgets/PagingRow.svelte";
  import { globalMessages } from "../utils/GlobalMessageState.svelte";

  export let typeId: string | null = null;
  export let userId: number | null = null;

  // TODO(plural): Extract API types to separate file.
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

  interface TournamentsResponse {
    data: TournamentInfo[];
    included?: TournamentTypeInfo[];
    links?: {
      next?: string | null;
      prev?: string | null;
    };
  }

  interface TournamentTypeInfo {
    id: string | number;
    type: string;
    attributes: {
      name: string;
    };
  }

  interface TournamentTypesResponse {
    data: TournamentTypeInfo[];
  }

  let tournaments: TournamentInfo[] = [];
  let tournamentTypes: Record<string, string> = {};
  let loading = true;
  let prevLink: string | null = null;
  let nextLink: string | null = null;
  let tournamentTypeName: string | null = null;
  let heading = "Recent Tournaments";

  function tournamentsApiUrl(tournamentTypeId: string | null | undefined): string {
    const query = [
      "/api/v1/public/tournaments?page[size]=10",
      "sort=-date,name",
    ];

    if (tournamentTypeId && tournamentTypeId.length > 0) {
      query.push(`filter[tournament_type_id]=${tournamentTypeId}`);
    }

    return query.join("&");
  }

  const fetchTournamentsUrl = tournamentsApiUrl(typeId);

  async function loadTournaments(url: string): Promise<void> {
    loading = true;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = (await response.json()) as TournamentsResponse;
      tournaments = data.data;
      prevLink = data.links?.prev ?? null;
      nextLink = data.links?.next ?? null;
    } catch (e) {
      const err = e as Error;
      globalMessages.errors.push(`Failed to load tournaments: ${err.message}`);
    } finally {
      loading = false;
    }
  }

  async function loadTournamentTypeName(): Promise<void> {
    if (!typeId) {
      tournamentTypeName = null;
      return;
    }

    try {
      const response = await fetch("/api/v1/public/tournament_types", {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await response.json()) as TournamentTypesResponse;
      const matchingType = data.data.find(
        (tournamentType) => String(tournamentType.id) === String(typeId)
      );
      tournamentTypeName = matchingType?.attributes.name ?? null;
    } catch {
      tournamentTypeName = null;
    }
  }

  async function goToPreviousPage(): Promise<void> {
    if (!prevLink || loading) return;

    await loadTournaments(prevLink);
  }

  async function goToNextPage(): Promise<void> {
    if (!nextLink || loading) return;

    await loadTournaments(nextLink);
  }

  onMount(async () => {
    if (typeId) {
      await Promise.all([loadTournaments(fetchTournamentsUrl), loadTournamentTypeName()]);
      return;
    }

    await loadTournaments(fetchTournamentsUrl);
  });

  $: heading = !typeId
    ? "Recent Tournaments"
    : tournamentTypeName
      ? `Tournaments: ${tournamentTypeName}`
      : "Tournaments";
</script>

<div>
  <GlobalMessages />

  <h1>{heading}</h1>

  <div>
    <PagingRow
      {loading}
      canGoBack={!!prevLink}
      canGoNext={!!nextLink}
      onBack={goToPreviousPage}
      onNext={goToNextPage}
    />

    {#if tournaments.length === 0 && !loading}
      <div class="m-3">No tournaments found for this type.</div>
    {:else}
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
              {new Date(tournament.attributes.date).toLocaleString(navigator.languages, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })} -
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
    {/if}

    <PagingRow
      {loading}
      canGoBack={!!prevLink}
      canGoNext={!!nextLink}
      onBack={goToPreviousPage}
      onNext={goToNextPage}
    />
  </div>
</div>
