import { mount } from "svelte";
import Stats from "../tournaments/Stats.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("stats_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(Stats, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament") ?? "") || -1,
      },
    });
  }
});
