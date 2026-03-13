import { mount } from "svelte";
import Players from "../players/Players.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("players_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(Players, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament") ?? "") || -1,
      },
    });
  }
});
