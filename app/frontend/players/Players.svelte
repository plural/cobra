<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import {
    loadDecks,
    loadPlayers,
    Player,
    type PlayersData,
    reinstatePlayer as reinstatePlayerRequest,
  } from "./PlayersData";
  import {
    DeckVisibility,
    deckVisibilityString,
    saveTournament,
    setPlayerRegistrationStatus as setPlayerRegistrationStatusRequest,
    setRegistrationStatus as setRegistrationStatusRequest,
  } from "../pairings/PairingsData";
  import PlayerForm from "./PlayerForm.svelte";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import { downloadBlob, quoteCsvValue } from "../utils/files";

  let { tournamentId }: { tournamentId: number } = $props();

  let data: PlayersData | undefined = $state();
  let newPlayer = $state(new Player());
  let registrationLockDescription = $derived.by(() => {
    if (!data) {
      return "";
    }

    if (data.tournament.registration_open) {
      if (data.tournament.locked_players === 0) {
        return "open";
      } else if (data.tournament.unlocked_players > 0) {
        return "open, part locked";
      }
      return "open, all locked";
    }

    if (data.tournament.locked_players === 0) {
      return "closed, unlocked";
    } else if (data.tournament.unlocked_players > 0) {
      return "closed, part unlocked";
    }
    return "closed";
  });
  let deckVisibilityDescription = $derived.by(() => {
    if (!data) {
      return;
    }

    return `swiss ${deckVisibilityString(data.tournament.swiss_deck_visibility)}, cut ${deckVisibilityString(data.tournament.cut_deck_visibility)}`;
  });

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    data = await loadPlayers(tournamentId);
  }

  async function newPlayerSavedCallback() {
    newPlayer = new Player();
    await loadData();
  }

  async function setPlayerRegistrationStatus(locked: boolean) {
    const success = await setPlayerRegistrationStatusRequest(
      tournamentId,
      locked,
    );
    if (!success) {
      return;
    }

    await loadData();
  }

  async function setRegistrationStatus(open: boolean) {
    const success = await setRegistrationStatusRequest(tournamentId, open);
    if (!success) {
      return;
    }

    await loadData();
  }

  async function setDeckVisibility(swiss: boolean, visibility: DeckVisibility) {
    if (!data) {
      return;
    }

    const tournamentEdit = $state.snapshot(data.tournament);

    if (swiss) {
      if (visibility === DeckVisibility.Open) {
        if (
          !confirm(
            "This will make all decklists visible to all registered players in the tournament. Are you sure?",
          )
        ) {
          return;
        }
      } else if (visibility === DeckVisibility.Public) {
        if (
          !confirm(
            "This will make all decklists visible to anyone who views the tournament. Are you sure?",
          )
        ) {
          return;
        }
      }

      tournamentEdit.swiss_deck_visibility = visibility;
    } else {
      if (visibility === DeckVisibility.Open) {
        if (
          !confirm(
            "This will make decklists of players registered for the cut visible to other players registered for the cut. Are you sure?",
          )
        ) {
          return;
        }
      } else if (visibility === DeckVisibility.Public) {
        if (
          !confirm(
            "This will make decklists of players registered for the cut visible to anyone who views the tournament. Are you sure?",
          )
        ) {
          return;
        }
      }

      tournamentEdit.cut_deck_visibility = visibility;
    }

    const success = await saveTournament(tournamentEdit);
    if (!success) {
      return;
    }

    await loadData();
  }

  async function downloadDecksSpreadsheet() {
    if (!data) {
      return;
    }

    const decks = await loadDecks(tournamentId);
    const headerCsv =
      decks
        .map((deck) => `Player,${quoteCsvValue(deck.details.player_name)},`)
        .join(",,") +
      "\n" +
      decks
        .map((deck) => `Deck,${quoteCsvValue(deck.details.name ?? "")},`)
        .join(",,") +
      "\n\n" +
      decks.map(() => "Min,Identity,Max").join(",,") +
      "\n" +
      decks
        .map(
          (deck) =>
            `${deck.details.min_deck_size},${quoteCsvValue(deck.details.identity_title)},${deck.details.max_influence}`,
        )
        .join(",,");

    const maxCards = decks.reduce(
      (max, deck) => Math.max(max, deck.cards.length),
      0,
    );
    let cardCsv = decks.map(() => "Qty,Card Name,Inf").join(",,");
    for (const i of Array(maxCards).keys()) {
      cardCsv +=
        "\n" +
        decks
          .map((deck) =>
            i < deck.cards.length
              ? `${deck.cards[i].quantity},${quoteCsvValue(deck.cards[i].title)},${deck.cards[i].influence > 0 ? deck.cards[i].influence : ""}`
              : ",,",
          )
          .join(",,");
    }
    cardCsv +=
      "\n\n" +
      decks
        .map(
          (deck) =>
            `${deck.cards.reduce((total, card) => total + card.quantity, 0)},Totals,${deck.cards.reduce((total, card) => total + card.influence, 0)}`,
        )
        .join(",,");

    downloadBlob(
      `Decks for ${data.tournament.name}.csv`,
      new Blob([`\ufeff${headerCsv}\n\n${cardCsv}`], { type: "text/csv" }),
    ); // "\ufeff" lets Excel know it's Unicode encoded
  }

  function downloadStreamingSpreadsheet() {
    if (!data) {
      return;
    }

    const contents =
      'Player,"Include in video coverage? (players were notified that in the cut it may not be possible to exclude them)"\n' +
      data.activePlayers
        .map(
          (player) =>
            `${quoteCsvValue(player.name)},${player.include_in_stream ? "Yes" : "No"}`,
        )
        .join("\n");
    downloadBlob(
      `Streaming information for ${data.tournament.name}.csv`,
      new Blob([`\ufeff${contents}`], { type: "text/csv" }),
    ); // "\ufeff" lets Excel know it's Unicode encoded
  }

  async function reinstatePlayer(player: Player) {
    const success = await reinstatePlayerRequest(tournamentId, player);
    if (!success) {
      return;
    }

    await loadData();
  }
</script>

<GlobalMessages />

{#if data}
  <a
    href={`/tournaments/${tournamentId}/players/meeting?back_to=players`}
    class="btn btn-primary"
  >
    <FontAwesomeIcon icon="list-ul" /> Player meeting
  </a>

  <!-- Register New Player -->
  <div class="alert alert-secondary mt-4">
    <h4>Register New Player</h4>
    <PlayerForm
      player={newPlayer}
      tournament={data.tournament}
      tournamentPolicies={data.tournamentPolicies}
      savedCallback={newPlayerSavedCallback}
    />
  </div>

  <!-- Players -->
  <h3 class="mt-4">
    Players

    <!-- Registration controls -->
    {#if data.tournament.self_registration}
      <span class="dropdown">
        <button
          class="btn btn-sm dropdown-toggle btn-light text-muted font-weight-bold"
          data-toggle="dropdown"
        >
          Registration: {registrationLockDescription}
        </button>
        <div class="dropdown-menu">
          <button
            class="dropdown-item {data.tournament.unlocked_players === 0
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setPlayerRegistrationStatus(true)}
          >
            <FontAwesomeIcon icon="lock" /> Lock all players, prevent editing
          </button>
          <button
            class="dropdown-item {data.tournament.locked_players === 0
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setPlayerRegistrationStatus(false)}
          >
            <FontAwesomeIcon icon="unlock" /> Unlock all players, allow editing
          </button>
          <div class="dropdown-divider"></div>
          <button
            class="dropdown-item {!data.tournament.registration_open
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setRegistrationStatus(false)}
          >
            <FontAwesomeIcon icon="lock" /> Close registration, prevent new players
          </button>
          <button
            class="dropdown-item {data.tournament.registration_open
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setRegistrationStatus(true)}
          >
            <FontAwesomeIcon icon="unlock" /> Open registration, allow new players
          </button>
        </div>
      </span>
    {/if}

    <!-- Deck controls -->
    {#if data.tournament.nrdb_deck_registration}
      <!-- Deck visibility dropdown -->
      <span class="dropdown">
        <button
          class="btn btn-sm dropdown-toggle btn-light text-muted font-weight-bold"
          data-toggle="dropdown"
        >
          Decks: {deckVisibilityDescription}
        </button>
        <div class="dropdown-menu">
          <button
            class="dropdown-item {data.tournament.swiss_deck_visibility ===
            DeckVisibility.Private
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setDeckVisibility(true, DeckVisibility.Private)}
          >
            <FontAwesomeIcon icon="eye-slash" /> Make decks in swiss private
          </button>
          <button
            class="dropdown-item {data.tournament.swiss_deck_visibility ===
            DeckVisibility.Open
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setDeckVisibility(true, DeckVisibility.Open)}
          >
            <FontAwesomeIcon icon="eye" /> Make decks in swiss open, visible to participants
          </button>
          <button
            class="dropdown-item {data.tournament.swiss_deck_visibility ===
            DeckVisibility.Public
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setDeckVisibility(true, DeckVisibility.Public)}
          >
            <FontAwesomeIcon icon="eye" />
            Make decks in swiss public, visible to anyone
          </button>
          <div class="dropdown-divider"></div>
          <button
            class="dropdown-item {data.tournament.cut_deck_visibility ===
            DeckVisibility.Private
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setDeckVisibility(false, DeckVisibility.Private)}
          >
            <FontAwesomeIcon icon="eye-slash" /> Make decks in cut private
          </button>
          <button
            class="dropdown-item {data.tournament.cut_deck_visibility ===
            DeckVisibility.Open
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setDeckVisibility(false, DeckVisibility.Open)}
          >
            <FontAwesomeIcon icon="eye" /> Make decks in cut open, visible to participants
          </button>
          <button
            class="dropdown-item {data.tournament.cut_deck_visibility ===
            DeckVisibility.Public
              ? 'disabled'
              : ''}"
            style="cursor: pointer"
            onclick={() => setDeckVisibility(false, DeckVisibility.Public)}
          >
            <FontAwesomeIcon icon="eye" /> Make decks in cut public, visible to anyone
          </button>
        </div>
      </span>

      <!-- Decks spreadsheet -->
      <button
        type="button"
        class="btn btn-link text-info"
        onclick={downloadDecksSpreadsheet}
      >
        <FontAwesomeIcon icon="download" />
        Decks spreadsheet
      </button>
    {/if}

    <!-- Streaming spreadsheet -->
    {#if data.tournament.allow_streaming_opt_out}
      <button
        type="button"
        class="btn btn-link text-info"
        onclick={downloadStreamingSpreadsheet}
      >
        <FontAwesomeIcon icon="download" />
        Streaming spreadsheet
      </button>
    {/if}
  </h3>
  <ul class="list-group">
    {#each data.activePlayers as player (player.id)}
      <li class="list-group-item">
        <PlayerForm
          {player}
          tournament={data.tournament}
          tournamentPolicies={data.tournamentPolicies}
          savedCallback={loadData}
          droppedCallback={loadData}
          deletedCallback={loadData}
        />
      </li>
    {/each}
  </ul>

  <!-- Dropped players -->
  {#if data.droppedPlayers}
    <h3 class="mt-4">Dropped Players</h3>
    <table class="table table-striped">
      <tbody>
        {#each data.droppedPlayers as player (player.id)}
          <tr>
            <td>
              {player.name} ({player.corp_id.name}, {player.runner_id.name})
            </td>
            <td>
              <button
                type="button"
                class="btn btn-warning"
                onclick={() => reinstatePlayer(player)}
              >
                <FontAwesomeIcon icon="arrow-up" /> Reinstate
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
