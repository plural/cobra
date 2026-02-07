import { mount } from "svelte";
import Profile from "../profile/Profile.svelte";

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("profile_anchor");
  if (anchor?.childNodes.length == 0) {
    mount(Profile, {
      target: anchor,
    });
  }
});
