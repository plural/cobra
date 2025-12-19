import { writable } from "svelte/store";

const initialValue: boolean = JSON.parse(
  localStorage.getItem("showReportedPairings") ?? "true",
) as boolean;
export const showReportedPairings = writable(initialValue);
showReportedPairings.subscribe(
  (value) => (localStorage.showReportedPairings = JSON.stringify(value)),
);
