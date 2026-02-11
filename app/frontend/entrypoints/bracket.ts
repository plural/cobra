import { mount } from "svelte";
import BracketPage from "../bracket/BracketPage.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("bracket_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(BracketPage, {
      target: anchor,
      props: {
        tournamentId:
          Number(anchor.getAttribute("data-tournament") ?? "") || -1,
      },
    });
  }
});
