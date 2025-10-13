import { mount } from "svelte";
import MyTournamentPage from "../tournaments/MyTournamentPage.svelte";

interface IdentityData {
  name: string | null;
  faction: string | null;
}

export interface MyTournamentData {
  tournament_id: number;
  user_id: number;
  identities?: {
    corp: IdentityData;
    runner: IdentityData;
  };
  pairings?: Pairing[];
}

export interface Player {
  user_id: number | null;
  name: string | null;
  pronouns: string | null;
  name_with_pronouns: string;
  corp_identity: string | null;
  corp_faction: string | null;
  runner_identity: string | null;
  runner_faction: string | null;
}

export interface Pairing {
  stage_id: number;
  stage_number: number;
  format: string;
  round_number: number;
  round_completed: boolean;
  pairing_id: number;
  table_number: number | null;
  side: string | number | null;
  opponent: Player;
  player_score: number | null;
  opponent_score: number | null;
  player_score_corp: number | null;
  player_score_runner: number | null;
  opponent_score_corp: number | null;
  opponent_score_runner: number | null;
  intentional_draw: boolean;
  two_for_one: boolean;
}

document.addEventListener("turbolinks:load", function () {
  const anchor = document.getElementById("my_tournament_anchor");
  if (anchor && anchor.childNodes.length == 0) {
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
