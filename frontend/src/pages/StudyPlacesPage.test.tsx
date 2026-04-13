import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StudyPlacesPage } from "./StudyPlacesPage";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 1,
        avg_rating: 4.8,
        wifi_speed: "fast",
        noise_level: "low",
        place_type: "library",
        power_availability: "sufficient",
        working_hours: "08:00-20:00",
        created_at: "2026-04-13T00:00:00.000Z",
      },
      {
        id: 2,
        avg_rating: 4.2,
        wifi_speed: "fast",
        noise_level: "medium",
        place_type: "cafe",
        power_availability: "sufficient",
        working_hours: "09:00-18:00",
        created_at: "2026-04-13T00:00:00.000Z",
      },
    ],
  } as Response);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("StudyPlacesPage", () => {
  it("renders at least one library and one cafe", () => {
    render(
      <MemoryRouter>
        <StudyPlacesPage />
      </MemoryRouter>
    );

    expect(fetchMock).toHaveBeenCalled();

    return waitFor(() => {
      expect(screen.getByText(/library/i)).toBeInTheDocument();
      expect(screen.getByText(/cafe/i)).toBeInTheDocument();
    });
  });
});