import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadStats } from "../pairings/PairingsData";
import { MockStats } from "./StatsTestData";
import Stats from "../tournaments/Stats.svelte";
import { getByText, render } from "@testing-library/svelte";
import { MockPairingsData } from "./RoundsTestData";
import { tick } from "svelte";

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadPairings: vi.fn(() => MockPairingsData),
  loadStats: vi.fn(() => MockStats),
}));

// These stubs allow us to test apexcharts
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

    // TODO: Add elim tables
    describe.each([
      ["Swiss corp table", "swiss-corp-table", [["Editorial Division: Ad Nihilum", "2 (40.0%)"], ["A Teia: IP Recovery", "1 (20.0%)"], ["MirrorMorph: Endless Iteration", "1 (20.0%)"], ["Thunderbolt Armaments: Peace Through Power", "1 (20.0%)"]]],
      ["Swiss runner table", "swiss-runner-table", [["Barry “Baz” Wong: Tri-Maf Veteran", "2 (40.0%)"], ["Esâ Afontov: Eco-Insurrectionist", "2 (40.0%)"], ["Dewi Subrotoputri: Pedagogical Dhalang", "1 (20.0%)"]]]
    ])("ID tables", (testName, tableId, ids) => {
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
    })

    // TODO: Cut conversion stats
  });
});