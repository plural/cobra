import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import TournamentType from "../tournaments/TournamentType.svelte";

describe("TournamentType", () => {
  it("renders correctly with default props", () => {
    const { getByText, queryByText } = render(TournamentType);

    expect(getByText("Beta Tournaments By Type")).toBeTruthy();
    expect(getByText("Type ID:")).toBeTruthy();
    // Default userId is -1, so user info shouldn't map.
    expect(queryByText(/User:/)).toBeNull();
  });

  it("renders correctly with specific typeId and user info", () => {
    const { getByText } = render(TournamentType, {
      props: {
        typeId: "standard",
        userId: 42,
        userName: "plural",
      },
    });

    expect(getByText("Type ID: standard")).toBeTruthy();
    expect(getByText("User: plural (42)")).toBeTruthy();
  });
});
