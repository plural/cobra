<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadPlayer, loadTournament, Tournament } from "./TournamentSettings";
  import { Player, savePlayer } from "../players/PlayersData";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import Identity from "../identities/Identity.svelte";

  let {
    tournamentId,
    userId,
    userName,
  }: {
    tournamentId: number;
    userId: number;
    userName?: string;
  } = $props();

  let tournament: Tournament | undefined = $state();
  let notices: string[] = $state([]);
  let player: Player | undefined = $state();
  let playerAgreed = $state(false);

  onMount(async () => {
    tournament = await loadTournament(tournamentId);
    player = await loadPlayer(tournamentId, userId);

    if (player.id === 0) {
      player.name = userName ?? "";
    }

    if (tournament.nrdb_deck_registration) {
      if (
        !tournament.registration_closed &&
        (player.id === 0 || !player.registration_locked)
      ) {
        notices.push("Registration is open.");
      }
      if (userId === tournament.user_id && tournament.any_player_unlocked) {
        notices.push("One or more players are unlocked for editing.");
      }
      if (player.id !== 0 && !player.registration_locked) {
        notices.push("Your registration is editable.");
      }
    }
  });

  async function register() {
    if (!player) {
      return;
    }

    player = await savePlayer(tournamentId, player);
  }
</script>

<GlobalMessages />

{#if tournament}
  <div class="container">
    <div class="row">
      <!-- Overview -->
      <div class="col-md-6">
        <!-- Notice -->
        {#each notices as notice (notice)}
          <div class="alert alert-info">{notice}</div>
        {/each}

        <div class="card">
          <!-- Shortcode -->
          {#if tournament.slug}
            <li class="list-group-item">
              <div class="small text-secondary">Shortcode:</div>
              {tournament.slug}
              (
              <a href={`/${tournament.slug}`}>
                {window.location.origin}/{tournament.slug}
              </a>
              )
            </li>
          {/if}

          <!-- Date -->
          <li class="list-group-item">
            <div>
              <div class="small text-secondary">Date:</div>
              {new Date(tournament.date).toLocaleString(navigator.languages, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </div>

            <div class="d-flex flex-wrap">
              {#if tournament.registration_starts}
                <div class="mr-4">
                  <div class="small text-secondary">Registration:</div>
                  {new Date(tournament.registration_starts).toLocaleTimeString(
                    navigator.languages,
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              {/if}

              {#if tournament.tournament_starts}
                <div class="mr-4">
                  <div class="small text-secondary">First Round:</div>
                  {new Date(tournament.tournament_starts).toLocaleTimeString(
                    navigator.languages,
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              {/if}

              {#if tournament.registration_starts ?? tournament.tournament_starts}
                <div style="align-self: flex-end">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              {/if}
            </div>
          </li>

          <!-- Organiser -->
          <li class="list-group-item">
            <div class="small text-secondary">Organiser:</div>
            {`${tournament.tournament_organizer} ${tournament.organizer_contact ? `- ${tournament.organizer_contact}` : ""}`}
          </li>

          <!-- Players -->
          <li class="list-group-item">
            <div class="small text-secondary">Players:</div>
            {tournament.active_player_count}
            {new Intl.PluralRules(navigator.languages).select(
              tournament.active_player_count,
            ) == "one"
              ? "active player"
              : "active players"}
            ({tournament.dropped_player_count} dropped)
          </li>

          <!-- QR Code -->
          <li class="list-group-item">
            <div class="small text-secondary">QR Code:</div>
            <div class="row col-sm-6">
              <a href={`/tournaments/${tournamentId}/qr`} target="_blank">
                <FontAwesomeIcon icon="qrcode" />
                Open Printable QR Code
              </a>
            </div>
          </li>
        </div>
      </div>

      <!-- Registration -->
      <div class="col-md-6">
        {#if player}
          {#if player.id !== 0}
            <!-- User is logged in and registered -->
            {#if player.active}
              <div class="card">
                <div class="card-header d-flex justify-content-between">
                  <h5 class="mb-0">My Registration Information</h5>
                  <a href={`/tournaments/${tournamentId}/registration`}>
                    <FontAwesomeIcon icon="edit" />
                    Edit
                  </a>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <div class="small text-secondary">Name:</div>
                    {player.name_with_pronouns}
                  </li>
                  <li class="list-group-item">
                    <div class="small text-secondary">Corp ID:</div>
                    <Identity
                      identity={player.corp_id}
                      name_if_missing="Unspecified"
                      icon_if_missing="interrupt"
                    />
                  </li>
                  <li class="list-group-item">
                    <div class="small text-secondary">Runner ID:</div>
                    <Identity
                      identity={player.runner_id}
                      name_if_missing="Unspecified"
                      icon_if_missing="interrupt"
                    />
                  </li>
                  <li class="list-group-item">
                    <div class="small text-secondary">First Round Bye:</div>
                    {#if player.first_round_bye}
                      <div class="badge badge-success">YES</div>
                    {:else}
                      <div class="badge badge-secondary">NO</div>
                    {/if}
                  </li>
                  <li class="list-group-item">
                    <div class="small text-secondary">Stream my games:</div>
                    {#if player.include_in_stream}
                      <div class="badge badge-success">YES</div>
                    {:else}
                      <div class="badge badge-secondary">NO</div>
                    {/if}
                  </li>
                </ul>
              </div>
            {:else}
              <h5 class="card-title">Rejoin this Event</h5>
              {#if userId == tournament.user_id}
                <p>
                  You can reinstate yourself on the
                  <a href={`/beta/tournaments/${tournamentId}/players`}>
                    Players
                  </a>
                  tab.
                </p>
              {:else}
                <p>Talk to a Tournament Organiser to rejoin the event.</p>
              {/if}
            {/if}
          {:else if !tournament.registration_closed}
            {#if userId != -1}
              <!-- User is logged in and not registered -->
              <div class="card alert alert-secondary">
                <h5 class="card-title">Register for this Event</h5>

                <div class="identities_form d-block">
                  <div class="form-group">
                    <label class="d-block" for="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      class="form-control"
                      bind:value={player.name}
                    />
                  </div>

                  <div class="form-group">
                    <label class="d-block" for="name">Pronouns</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Example: they/them"
                      class="form-control"
                      bind:value={player.pronouns}
                    />
                  </div>

                  {#if !tournament.nrdb_deck_registration}
                    <div class="form-group">
                      <label class="d-block" for="corp_identity">Corp ID</label>
                      <input
                        id="corp_identity"
                        type="text"
                        placeholder="Search for corp ID"
                        class="form-control corp_identities"
                        bind:value={player.corp_id.name}
                      />
                    </div>

                    <div class="form-group">
                      <label class="d-block" for="runner_identity">
                        Runner ID
                      </label>
                      <input
                        id="runner_identity"
                        type="text"
                        placeholder="Search for runner ID"
                        class="form-control runner_identities"
                        bind:value={player.runner_id.name}
                      />
                    </div>
                  {/if}

                  {#if tournament.allow_streaming_opt_out}
                    <div class="form-group">
                      <label for="include_in_stream">
                        Should we include your games in video coverage of this
                        event? Note: During a top cut it may not be possible to
                        exclude you from coverage.
                      </label>
                      <input
                        id="include_in_stream"
                        type="checkbox"
                        bind:checked={player.include_in_stream}
                      />
                      <label for="include_in_stream">
                        Include my games in video coverage
                      </label>
                    </div>
                  {/if}

                  {#if userId === tournament.user_id}
                    <input
                      id="first_round_bye"
                      type="checkbox"
                      bind:checked={player.first_round_bye}
                    />
                    <label for="first_round_bye">First Round Bye</label>

                    {#if tournament.manual_seed}
                      <label class="d-block" for="manual_seed">
                        Manual Seed
                      </label>
                      <input
                        id="manual_seed"
                        type="number"
                        placeholder="Set seed"
                        class="form-control"
                        bind:value={player.manual_seed}
                      />
                    {/if}
                  {/if}

                  <hr />

                  <div class="form-group">
                    <label for="consent_data_sharing">
                      Your name, pronouns and Netrunner deck identities will be
                      publicly visible on this website. If you submit decklists
                      they will be shared with the organiser. If you enter a
                      round with open decklists, they may be shared with
                      participants or made public.
                    </label>
                    <input
                      id="consent_data_sharing"
                      type="checkbox"
                      bind:checked={playerAgreed}
                    />
                    <label for="consent_data_sharing">
                      I agree to these terms
                    </label>
                  </div>
                </div>

                <div class="text-right">
                  <button
                    type="button"
                    class="btn btn-primary"
                    disabled={!playerAgreed}
                    onclick={register}
                  >
                    <FontAwesomeIcon icon="user-plus" />
                    {tournament.nrdb_deck_registration
                      ? "Deck Registration"
                      : "Register"}
                  </button>
                </div>
              </div>
            {:else}
              <!-- User is not logged in and not registered -->
              <div class="card card-body alert alert-warning">
                <h5 class="card-title">Register for this Event</h5>

                <p class="mb-1">
                  You must be logged in to register for this tournament:
                </p>
                <a
                  class="alert-link"
                  href={`/login?return_to=/beta/tournaments/${tournamentId}`}
                >
                  <FontAwesomeIcon icon="sign-in" /> Sign in
                </a>

                <p class="mt-4 mb-1">
                  Don't have an account? Register with NetrunnerDB, then return
                  to Cobra to log in:
                </p>
                <a class="alert-link" href="https://netrunnerdb.com/register/">
                  <i class="icon icon-link"></i> Create NRDB Account
                </a>
              </div>
            {/if}
          {/if}
        {:else}
          <div class="d-flex align-items-center m-2">
            <div class="spinner-border m-auto"></div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
