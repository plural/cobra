<script lang="ts">
  import { onMount } from "svelte";
  import GlobalMessages from "../widgets/GlobalMessages.svelte";
  import { loadTournament, loadTournamentNotice, Tournament } from "./TournamentSettings";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  let { tournamentId }: { tournamentId: number } = $props();

  let tournament: Tournament | undefined = $state();
  let notice = $state("");

  onMount(async () => {
    tournament = await loadTournament(tournamentId);
    notice = await loadTournamentNotice(tournamentId);
  });
</script>

<GlobalMessages />

{#if tournament}
  <div class="container">
    <div class="row">
      <!-- Overview -->
      <div class="col-md-6">
        <!-- Notice -->
        {#if notice}
          <div class="alert alert-info">{notice}</div>
        {/if}
  
        <div class="card">
          <!-- Shortcode -->
          {#if tournament.slug}
            <li class="list-group-item">
              <div class="small text-secondary">Shortcode:</div>
              {tournament.slug} (<a href={`/${tournament.slug}`}>{window.location.origin}/{tournament.slug}</a>)
            </li>
          {/if}
          
          <!-- Date -->
          <li class="list-group-item">
            <div>
              <div class="small text-secondary">Date:</div>
              {new Date(tournament.date).toLocaleString(navigator.languages, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
            </div>
            
            <div class="d-flex flex-wrap">
              {#if tournament.registration_starts}
                <div class="mr-2">
                  <div class="small text-secondary">Registration:</div>
                  {new Date(tournament.registration_starts).toLocaleTimeString(navigator.languages, { hour: "2-digit", minute: "2-digit" })}
                </div>
              {/if}

              {#if tournament.tournament_starts}
                <div class="mr-2">
                  <div class="small text-secondary">First Round:</div>
                  {new Date(tournament.tournament_starts).toLocaleTimeString(navigator.languages, { hour: "2-digit", minute: "2-digit" })}
                </div>
              {/if}

              {#if tournament.registration_starts ?? tournament.tournament_starts}
                <div class="mr-2" style="align-self: flex-end">
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
            {tournament.active_player_count} {new Intl.PluralRules(navigator.languages).select(tournament.active_player_count) == "one" ? "active player" : "active players"}
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
    </div>
  </div>
{:else}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{/if}
