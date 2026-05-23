import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import Home from "../home/Home.svelte";

describe("Beta Home", () => {
  it("displays the beta home page h1", () => {
    const { getByText } = render(Home);

    expect(getByText("Beta Home Page").tagName).toBe("H1");
  });
});