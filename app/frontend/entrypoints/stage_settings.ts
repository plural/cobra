import { mount } from "svelte";
import StageSettings from "../stages/StageSettings.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("stage_settings_anchor");
  if (anchor && anchor.childNodes.length === 0) {
    mount(StageSettings, {
      target: anchor,
      props: {
        tournamentId: Number(anchor.getAttribute("data-tournament") ?? "") || -1,
        stageId: Number(anchor.getAttribute("data-stage") ?? "") || -1,
      },
    });
  }
});
