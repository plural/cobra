import { mount } from "svelte";
import Tournament from "../tournaments/Tournament.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("tournament_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(Tournament, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament") ?? "") || -1,
        userId: Number(anchor.getAttribute("data-user") ?? "") || -1,
      },
    });
  }
});
