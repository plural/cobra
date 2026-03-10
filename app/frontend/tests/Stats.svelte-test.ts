import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadStats } from "../pairings/PairingsData";
import { MockCutStats, MockStats } from "./StatsTestData";
import Stats from "../tournaments/Stats.svelte";
import { getByText, render } from "@testing-library/svelte";
import { MockPairingsData, MockSingleElimCutStage, MockSwissStage } from "./RoundsTestData";
import { tick } from "svelte";

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadPairings: vi.fn(() => MockPairingsData),
  loadStats: vi.fn(() => MockStats),
  loadCutStats: vi.fn(() => MockCutStats),
}));

// These stubs allow us to test ApexCharts
const ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
const SVGElement = vi.fn(() => ({
  getScreenCTM: vi.fn(() => ({
    writable: true,
    value: vi.fn(),
  })),
  getBBox: vi.fn(() => ({
    writable: true,
    value: vi.fn().mockReturnValue({
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    }),
  })),
  getComputedTextLength: vi.fn(() => ({
    writable: true,
    value: vi.fn().mockReturnValue(10),
  })),
  createSVGMatrix: vi.fn(() => ({
    writable: true,
    value: vi.fn().mockReturnValue({
      x: 10,
      y: 10,
      inverse: vi.fn(),
      multiply: vi.fn(),
    }),
  })),
}));
vi.stubGlobal('ResizeObserver', ResizeObserver);
vi.stubGlobal('SVGElement', SVGElement);

describe("Stats", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // TODO: when stats are not available

  describe("when stats are available", () => {
    beforeEach(async () => {
      vi.spyOn(MockPairingsData, "stages", "get").mockReturnValue([MockSwissStage, MockSingleElimCutStage]);

      render(Stats, { tournamentId: 1 });
      await tick();
    });

    // it("displays Swiss corp faction chart", () => {
    //   const table = document.getElementById("swiss-corp-faction-chart");
    //   expect(table).not.toBeNull();
    //   if (!table) {
    //     return;
    //   }

    //   const pieSeries = document.getElementsByClassName("apexcharts-pie-series");
    //   expect(pieSeries).not.toBeNull();
    //   expect(pieSeries.length).not.toBe(0);
    //   // if (!pieSeries) {
    //   //   return;
    //   // }
    // });

    describe.each([
      ["Swiss corp ID table", "swiss-corp-table", [["Editorial Division: Ad Nihilum", "2 (40.0%)"], ["A Teia: IP Recovery", "1 (20.0%)"], ["MirrorMorph: Endless Iteration", "1 (20.0%)"], ["Thunderbolt Armaments: Peace Through Power", "1 (20.0%)"]]],
      ["Swiss runner ID table", "swiss-runner-table", [["Barry “Baz” Wong: Tri-Maf Veteran", "2 (40.0%)"], ["Esâ Afontov: Eco-Insurrectionist", "2 (40.0%)"], ["Dewi Subrotoputri: Pedagogical Dhalang", "1 (20.0%)"]]],
      ["elim corp ID table", "elim-corp-table", [["Editorial Division: Ad Nihilum", "1 (33.3%)"], ["MirrorMorph: Endless Iteration", "1 (33.3%)"], ["Thunderbolt Armaments: Peace Through Power", "1 (33.3%)"]]],
      ["elim runner ID table", "elim-runner-table", [["Esâ Afontov: Eco-Insurrectionist", "2 (66.7%)"], ["Dewi Subrotoputri: Pedagogical Dhalang", "1 (33.3%)"]]],
      ["corp faction cut conversion table", "cut-corp-faction-table", [["Haas-Bioroid", "2 / 2 (100.0%)"], ["NBN", "1 / 2 (50.0%)"], ["Jinteki", "0 / 1 (0.0%)"]]],
      ["runner faction cut conversion table", "cut-runner-faction-table", [["Anarch", "2 / 2 (100.0%)"], ["Shaper", "1 / 1 (100.0%)"], ["Criminal", "0 / 2 (0.0%)"]]],
      ["corp ID cut conversion table", "cut-corp-id-table", [["MirrorMorph: Endless Iteration", "1 / 1 (100.0%)"], ["Thunderbolt Armaments: Peace Through Power", "1 / 1 (100.0%)"], ["Editorial Division: Ad Nihilum", "1 / 2 (50.0%)"], ["A Teia: IP Recovery", "0 / 1 (0.0%)"]]],
      ["runner ID cut conversion table", "cut-runner-id-table", [["Esâ Afontov: Eco-Insurrectionist", "2 / 2 (100.0%)"], ["Dewi Subrotoputri: Pedagogical Dhalang", "1 / 1 (100.0%)"], ["Barry “Baz” Wong: Tri-Maf Veteran", "0 / 2 (0.0%)"]]]
    ])("stats tables", (testName, tableId, ids) => {
      it(testName, () => {
        const table = document.getElementById(tableId);
        expect(table).not.toBeNull();
        if (!table) {
          return;
        }
  
        expect(loadStats).toHaveBeenCalledOnce();
        const tableRows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        expect(tableRows.length).toBe(ids.length);
        for (let i = 0; i < ids.length; i++) {
          expect(getByText(tableRows[i], ids[i][0])).toBeInTheDocument();
          expect(getByText(tableRows[i], ids[i][1])).toBeInTheDocument();
        }
      });
    });
  });
});