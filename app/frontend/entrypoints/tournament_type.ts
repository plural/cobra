import { mount } from "svelte";
import TournamentType from "../tournaments/TournamentType.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("tournament_type_anchor");
  if (anchor?.childNodes.length == 0) {
    const userIdAttr = anchor.getAttribute("data-user-id");

    mount(TournamentType, {
      target: anchor,
      props: {
        typeId: anchor.getAttribute("data-type-id") ?? "",
        userId:
          userIdAttr && userIdAttr.length > 0 ? Number(userIdAttr) : null,
        userName: anchor.getAttribute("data-user-name") ?? "",
      },
    });
  }
});