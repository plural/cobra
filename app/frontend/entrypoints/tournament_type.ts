import { mount } from "svelte";
import TournamentType from "../tournaments/TournamentType.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("tournament_type_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(TournamentType, {
      target: anchor,
      props: {
        typeId: anchor.getAttribute("data-type-id") ?? "",
        userId: Number(anchor.getAttribute("data-user-id") ?? "") || -1,
        userName: anchor.getAttribute("data-user-name") ?? "",
      },
    });
  }
});