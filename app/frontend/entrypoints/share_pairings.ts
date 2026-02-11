import { mount } from "svelte";
import StageSettings from "../pairings/Share.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("share_pairings_anchor");
  if (anchor?.childNodes.length === 0) {
    mount(StageSettings, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament") ?? "") || -1,
        roundId: Number(anchor.getAttribute("data-round") ?? "") || -1,
      },
    });
  }
});
