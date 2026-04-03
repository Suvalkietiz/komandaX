import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StudyPlacesPage } from "./StudyPlacesPage";

describe("StudyPlacesPage", () => {
  it("renders at least one library and one cafe", () => {
    render(<StudyPlacesPage />);

    // Suranda visus .place-card elementus
    const cards = Array.from(document.querySelectorAll(".place-card"));

    // Patikrina, kad bent vienas card turi library
    const hasLibrary = cards.some(card =>
      /library/i.test(card.textContent ?? "")
    );
    expect(hasLibrary).toBe(true);

    // Patikrina, kad bent vienas card turi cafe
    const hasCafe = cards.some(card =>
      /cafe/i.test(card.textContent ?? "")
    );
    expect(hasCafe).toBe(true);
  });
});