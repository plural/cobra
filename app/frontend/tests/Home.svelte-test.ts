import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import Home from "../home/Home.svelte";

describe("Home", () => {
  it("displays the home page content", () => {
    const { getByText, getByPlaceholderText } = render(Home);

    expect(getByText("Today's tournaments").tagName).toBe("H4");
    expect(getByText("Tournaments go here")).toBeDefined();
    expect(getByText("Got a shortcode?").tagName).toBe("LABEL");
    expect(getByPlaceholderText("SHRT")).toBeDefined();
    expect(getByText("More tournaments")).toBeDefined();
  });
});
