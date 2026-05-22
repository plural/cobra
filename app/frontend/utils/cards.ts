import type { ApiResponse } from "./network";

export interface Card {
  id: string;
  count: number;
  printing?: Printing;
}

export interface Deck {
  id: number;
  uuid: string;
  date_creation: string;
  date_upate: string;
  name: string;
  description: string;
  mwl_code: string;
  tags: string;
  cards: Card[];
  side_id?: string;
  identity_printing_id?: string;
  identity_title?: string;
}

export interface Printing {
  card_id: string;
  title: string;
  card_type_id: string;
  side_id: string;
  faction_id: string;
  influence_cost: number | null;
  influence_limit: number | null;
  minimum_deck_size: number | null;
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
