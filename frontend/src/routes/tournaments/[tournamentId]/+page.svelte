<script lang="ts">
  import FontAwesomeIcon from "$lib/components/FontAwesomeIcon.svelte";
  import ModalDialog from "$lib/components/ModalDialog.svelte";
  import { resolve } from "$app/paths";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";

  let { data }: PageProps = $props();

  let qrCodeImageData = $state("");

  // TODO: Can notices be a derived variable?
  let notices = $derived.by(() => {
    let notices: string[] = [];
    // if (data.tournament.nrdb_deck_registration) {
    //   if (
    //     !data.tournament.registration_closed &&
    //     (player?.id === 0 || !player?.registration_locked)
    //   ) {
    //     notices.push("Registration is open.");
    //   }
    //   if (userId === data.tournament.user_id && data.tournament.any_player_unlocked) {
    //     notices.push("One or more players are unlocked for editing.");
    //   }
    //   if (player?.id !== 0 && !player?.registration_locked) {
    //     notices.push("Your registration is editable.");
    //   }
    // }

    return notices;
  });

  function printQRCode() {
    const qrCodeDiv = document.getElementById("qrCode");
    if (!qrCodeDiv) {
      return;
    }

    const printWindow = window.open();
    if (!printWindow) {
      return;
    }
    printWindow.document.body.append(qrCodeDiv.cloneNode(true));
    printWindow.print();
    printWindow.close();
  }
</script>

{#if data.tournament.id === 0}
  <div class="d-flex align-items-center m-2">
    <div class="spinner-border m-auto"></div>
  </div>
{:else}
  <div class="container">
    <!-- Notices -->
    <div class="row">
      <div class="col-md-12">
        {#each notices as notice (notice)}
          <div class="alert alert-info">{notice}</div>
        {/each}
      </div>
    </div>

    <div class="row">
      <!-- Overview -->
      <div class="col-md-6">
        <div class="card">
          <!-- Shortcode -->
          {#if data.tournament.slug}
            <li class="list-group-item" aria-label="shortcode">
              <div class="small text-secondary">Shortcode:</div>
              {data.tournament.slug}
              (<a href={resolve(`/tournaments/${data.tournament.slug}`)}>
                <!-- {window.location.origin}/{tournament.slug} -->
                {resolve(`/tournaments/${data.tournament.slug}`)}
              </a>)
            </li>
          {/if}

          <!-- Date -->
          <li class="list-group-item">
            <div aria-label="date">
              <div class="small text-secondary">Date:</div>
              {new Date(data.tournament.date).toLocaleString(navigator.languages, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </div>

            <div class="d-flex flex-wrap">
              {#if data.tournament.registration_starts}
                <div class="mr-4" aria-label="registration time">
                  <div class="small text-secondary">Registration:</div>
                  {new Date(data.tournament.registration_starts).toLocaleTimeString(
                    navigator.languages,
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              {/if}

              {#if data.tournament.tournament_starts}
                <div class="mr-4" aria-label="first round time">
                  <div class="small text-secondary">First Round:</div>
                  {new Date(data.tournament.tournament_starts).toLocaleTimeString(
                    navigator.languages,
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              {/if}

              {#if data.tournament.registration_starts ?? data.tournament.tournament_starts}
                <div style="align-self: flex-end" aria-label="time zone">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              {/if}
            </div>
          </li>

          <!-- Organiser -->
          <li class="list-group-item" aria-label="tournament organiser">
            <div class="small text-secondary">Organiser:</div>
            {`${data.tournament.tournament_organizer} ${data.tournament.organizer_contact ? `- ${data.tournament.organizer_contact}` : ""}`}
          </li>

          <!-- Players -->
          <li class="list-group-item" aria-label="player count">
            <div class="small text-secondary">Players:</div>
            {data.tournament.active_player_count}
            {new Intl.PluralRules(navigator.languages).select(
              data.tournament.active_player_count,
            ) == "one"
              ? "active player"
              : "active players"}
            ({data.tournament.dropped_player_count} dropped)
          </li>

          <!-- QR Code -->
          <li class="list-group-item">
            <div class="small text-secondary">QR Code:</div>
            <div class="row col-sm-6" aria-label="QR code">
              <button
                type="button"
                class="btn btn-link p-0"
                data-toggle="modal"
                data-target="#qrCodeDialog"
              >
                <FontAwesomeIcon icon="qrcode" />
                Open QR Code
              </button>

              <ModalDialog id="qrCodeDialog" headerText="QR Code">
                <div class="text-center">
                  <button
                    type="button"
                    class="btn btn-primary mb-3"
                    onclick={printQRCode}
                  >
                    <FontAwesomeIcon icon="print" /> Print
                  </button>
                  <div id="qrCode">
                    <h4 class="mb-3">
                      {page.url.origin}/{data.tournament.slug}
                    </h4>
                    <div class="d-inline-block bg-white p-3 rounded shadow-sm">
                      <img
                        src={qrCodeImageData}
                        class="w-100 h-100"
                        alt="QR code of the tournament's URL"
                      />
                    </div>
                  </div>
                </div>
              </ModalDialog>
            </div>
          </li>

          <!-- More Information -->
          {#if data.tournament.event_link}
            <li class="list-group-item">
              <div class="small text-secondary">More Information:</div>
              <a href={data.tournament.event_link} target="_blank" rel="external">{data.tournament.event_link}</a>
            </li>
          {/if}
        </div>
      </div>
      </div>
      
  </div>
{/if}
