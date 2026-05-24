import type { ApiResponse } from "./network";

export interface NrdbCard {
  id: string;
  count: number;
  printing?: Printing;
}

export interface NrdbDeck {
  id: number;
  uuid: string;
  date_creation: string;
  date_upate: string;
  name: string;
  description: string;
  mwl_code: string;
  tags: string;
  cards: NrdbCard[];
}

export class Printing {
  card_id = "";
  title = "";
  card_type_id = "";
  side_id = "";
  faction_id = "";
  influence_cost = 0;
  influence_limit = 0;
  minimum_deck_size = 0;
}

export interface Card {
  id: number;
  deck_id: number;
  title: string;
  quantity: number;
  influence: number;
  nrdb_card_id: string;
  created_at: string;
  updated_at: string;
  nrdb_printing_id: number | null;
  card_type_id: string;
  faction_id: string;
  influence_cost: number;
}

export interface Deck {
  details: {
    id: number;
    player_id: number;
    side_id: string;
    name: string | null;
    identity_title: string;
    min_deck_size: number;
    max_influence: number;
    nrdb_uuid: string | null;
    identity_nrdb_card_id: string;
    created_at: string;
    updated_at: string;
    identity_nrdb_printing_id: number | null;
    user_id: number;
    faction_id: string;
    mine: boolean;
    player_name: string;
  };
  cards: Card[];
}

export function convertNrdbDeck(nrdbDeck: NrdbDeck, printings: Map<string, Printing>): Deck {
  let identityNrdbId = 0;
  let identity = new Printing();
  const cards: Card[] = [];
  nrdbDeck.cards.forEach((card: NrdbCard) => {
    const printing = printings.get(card.id);
    if (!printing) {
      return;
    }

    if (printing.card_type_id.endsWith("identity")) {
      identityNrdbId = parseInt(card.id);
      identity = printing;
      return;
    }

    cards.push({
      id: parseInt(card.id),
      deck_id: nrdbDeck.id,
      title: printing.title,
      quantity: card.count,
      influence: printing.influence_cost * card.count,
      nrdb_card_id: printing.card_id,
      created_at: "", // TODO: Should this be optional?
      updated_at: "", // TODO: Should this be optional?
      nrdb_printing_id: parseInt(card.id),
      card_type_id: printing.card_type_id,
      faction_id: printing.faction_id,
      influence_cost: printing.influence_cost
    });
  });

  return {
    details: {
      id: nrdbDeck.id,
      player_id: 0, // TODO: What should this be?
      side_id: identity.side_id,
      name: nrdbDeck.name,
      identity_title: identity.title,
      min_deck_size: identity.minimum_deck_size,
      max_influence: identity.influence_limit,
      nrdb_uuid: nrdbDeck.uuid,
      identity_nrdb_card_id: identity.card_id,
      created_at: nrdbDeck.date_creation,
      updated_at: nrdbDeck.date_upate,
      identity_nrdb_printing_id: identityNrdbId,
      user_id: 0, // TODO: What should this be?
      faction_id: identity.faction_id,
      mine: false, // TODO: What should this be?
      player_name: "" // TODO: What should this be?
    },
    cards: cards
  };
}

export async function loadPrintings() {
  const response = await fetch(
    "https://api.netrunnerdb.com/api/v3/public/printings?page[size]=10000&fields[printings]=card_id,card_type_id,title,side_id,faction_id,minimum_deck_size,influence_limit,influence_cost",
    { method: "GET" },
  );

  let data: ApiResponse<Printing> | null = null;
  if (response.status === 200) {
    data = (await response.json()) as ApiResponse<Printing>;
  }
  // TODO: Handle error

  return data;
}
