import { mount } from "svelte";
import Registration from "../players/Registration.svelte";
import { type NrdbDeck } from "../utils/decks.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("registration_anchor");
  if (anchor?.childNodes.length == 0) {
    const decksString = anchor.getAttribute("data-user-decks");
    mount(Registration, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament-id") ?? "") || -1,
        playerId: Number(anchor.getAttribute("data-player-id") ?? "") || -1,
        nrdbDecks: decksString ? (JSON.parse(decksString) as NrdbDeck[]) : [],
      },
    });
  }
});
