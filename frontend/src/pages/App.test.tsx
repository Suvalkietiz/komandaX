import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("Route /new-study-place", () => {
  it("renders the New Study Place page", () => {
    window.history.pushState({}, "", "/new-study-place");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /new study place form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save study place/i })
    ).toBeInTheDocument();
  });
});

