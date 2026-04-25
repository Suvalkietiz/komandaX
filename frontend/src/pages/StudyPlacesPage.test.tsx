/** @jest-environment jsdom */

import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { StudyPlacesPage } from "./StudyPlacesPage";

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe("StudyPlacesPage", () => {
  it("renders at least one library and one cafe", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          avg_rating: 4.5,
          wifi_speed: "fast",
          noise_level: "low",
          place_type: "library",
          power_availability: "sufficient",
          working_hours: "09:00-18:00",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          avg_rating: 4.0,
          wifi_speed: "fast",
          noise_level: "medium",
          place_type: "cafe",
          power_availability: "sufficient",
          working_hours: "08:00-20:00",
          created_at: "2023-01-02T00:00:00Z",
        },
      ],
    });

    render(
     <MemoryRouter>
      <StudyPlacesPage />
     </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/library/i)).toBeInTheDocument();
      expect(screen.getByText(/cafe/i)).toBeInTheDocument();
    });
  });
});