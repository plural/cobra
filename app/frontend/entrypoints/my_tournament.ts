import { mount } from "svelte";
import MyTournamentPage from "../tournaments/MyTournamentPage.svelte";
import type { MyTournamentData } from "../tournaments/TournamentSettings";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("my_tournament_anchor");
  if (anchor?.childNodes.length == 0) {
    const dataJson = anchor.getAttribute("data-my-tournament") ?? "{}";
    const data = JSON.parse(dataJson) as MyTournamentData;

    mount(MyTournamentPage, {
      target: anchor,
      props: {
        data: data,
      },
    });
  }
});
