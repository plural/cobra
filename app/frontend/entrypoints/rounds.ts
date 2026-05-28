import { mount } from "svelte";
import Rounds from "../pairings/Rounds.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("rounds_anchor");
  if (anchor?.childNodes.length == 0) {
    const forcePlayerView = anchor.getAttribute("data-force-player-view");
    mount(Rounds, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament") ?? "") || -1,
        betaVersion: forcePlayerView !== "true",
        playerView: forcePlayerView === "true",
      },
    });
  }
});
