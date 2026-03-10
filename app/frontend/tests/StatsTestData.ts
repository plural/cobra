import type { Stats } from "../pairings/PairingsData";

export const MockStats: Stats = {
  swiss: {
    num_players: 5,
    corp: {
      ids: [{
        identity: {
          name: "Editorial Division: Ad Nihilum",
          faction: "nbn"
        },
        count: 2
      },
      {
        identity: {
          name: "Thunderbolt Armaments: Peace Through Power",
          faction: "haas-bioroid"
        },
        count: 1
      },
      {
        identity: {
          name: "MirrorMorph: Endless Iteration",
          faction: "haas-bioroid"
        },
        count: 1
      },
      {
        identity: {
          name: "A Teia: IP Recovery",
          faction: "jinteki"
        },
        count: 1
      }],
      factions: [{
        name: "nbn",
        count: 2
      },
      {
        name: "haas-bioroid",
        count: 2
      },
      {
        name: "jinteki",
        count: 1
      }],
    },
    runner: {
      ids: [
      {
        identity: {
          name: "Dewi Subrotoputri: Pedagogical Dhalang",
          faction: "shaper"
        },
        count: 1
      },
      {
        identity: {
          name: "Esâ Afontov: Eco-Insurrectionist",
          faction: "anarch"
        },
        count: 2
      },
      {
        identity: {
          name: "Barry “Baz” Wong: Tri-Maf Veteran",
          faction: "criminal"
        },
        count: 2
      }],
      factions: [{
        name: "anarch",
        count: 1
      },
      {
        name: "criminal",
        count: 2
      },
      {
        name: "shaper",
        count: 2
      }]
    }
  },
  elim: {
    num_players: 0,
    corp: {
      ids: [{
        identity: {
          name: "",
          faction: ""
        },
        count: 0
      }],
      factions: [{
        name: "",
        count: 0
      }]
    },
    runner: {
      ids: [{
        identity: {
          name: "",
          faction: ""
        },
        count: 0
      }],
      factions: [{
        name: "",
        count: 0
      }]
    }
  }
}