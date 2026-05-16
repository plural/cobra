import { mount } from "svelte";
import Registration from "../players/Registration.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("registration_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(Registration, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament-id") ?? "") || -1,
        userId:
          Number(anchor.getAttribute("data-user-id") ?? "") || -1,
      },
    });
  }
});
