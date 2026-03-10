import type { CutStats, Stats } from "../pairings/PairingsData";

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
        count: 2
      },
      {
        name: "criminal",
        count: 2
      },
      {
        name: "shaper",
        count: 1
      }]
    }
  },
  elim: {
    num_players: 3,
    corp: {
      ids: [{
        identity: {
          name: "Editorial Division: Ad Nihilum",
          faction: "nbn"
        },
        count: 1
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
      }],
      factions: [{
        name: "nbn",
        count: 1
      },
      {
        name: "haas-bioroid",
        count: 2
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
      }],
      factions: [{
        name: "anarch",
        count: 2
      },
      {
        name: "shaper",
        count: 1
      }]
    }
  },
};

export const MockCutStats: CutStats = {
  corp: {
    ids: [{
      identity: {
        name: "Editorial Division: Ad Nihilum",
        faction: "nbn"
      },
      numSwissPlayers: 2,
      numCutPlayers: 1,
      cutConversion: 50.0
    },
    {
      identity: {
        name: "Thunderbolt Armaments: Peace Through Power",
        faction: "haas-bioroid"
      },
      numSwissPlayers: 1,
      numCutPlayers: 1,
      cutConversion: 100.0
    },
    {
      identity: {
        name: "MirrorMorph: Endless Iteration",
        faction: "haas-bioroid"
      },
      numSwissPlayers: 1,
      numCutPlayers: 1,
      cutConversion: 100.0
    },
    {
      identity: {
        name: "A Teia: IP Recovery",
        faction: "jinteki"
      },
      numSwissPlayers: 1,
      numCutPlayers: 0,
      cutConversion: 0.0
    }],
    factions: [{
      name: "haas-bioroid",
      numSwissPlayers: 2,
      numCutPlayers: 2,
      cutConversion: 100.0
    },
    {
      name: "nbn",
      numSwissPlayers: 2,
      numCutPlayers: 1,
      cutConversion: 50.0
    },
    {
      name: "jinteki",
      numSwissPlayers: 1,
      numCutPlayers: 0,
      cutConversion: 0.0
    }]
  },
  runner: {
    ids: [{
      identity: {
        name: "Dewi Subrotoputri: Pedagogical Dhalang",
        faction: "shaper"
      },
      numSwissPlayers: 1,
      numCutPlayers: 1,
      cutConversion: 100.0
    },
    {
      identity: {
        name: "Esâ Afontov: Eco-Insurrectionist",
        faction: "anarch"
      },
      numSwissPlayers: 2,
      numCutPlayers: 2,
      cutConversion: 100.0
    },
    {
      identity: {
        name: "Barry “Baz” Wong: Tri-Maf Veteran",
        faction: "criminal"
      },
      numSwissPlayers: 2,
      numCutPlayers: 0,
      cutConversion: 0.0
    }],
    factions: [{
      name: "anarch",
      numSwissPlayers: 2,
      numCutPlayers: 2,
      cutConversion: 100.0
    },
    {
      name: "shaper",
      numSwissPlayers: 1,
      numCutPlayers: 1,
      cutConversion: 100.0
    },
    {
      name: "criminal",
      numSwissPlayers: 2,
      numCutPlayers: 0,
      cutConversion: 0.0
    }]
  }
};
