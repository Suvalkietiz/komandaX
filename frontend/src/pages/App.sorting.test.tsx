/** @jest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

declare const global: any;

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

describe("Integration: sorting flow", () => {
  it("sorts study places by created_at (newest first)", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: "54.6872", lon: "25.2797" }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            name: "Senesnė vieta",
            lat: 54.70,
            lon: 25.30,
            created_at: "2023-01-01",
          },
          {
            id: "2",
            name: "Nauja vieta",
            lat: 54.688,
            lon: 25.280,
            created_at: "2024-01-01",
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            name: "Senesnė vieta",
            lat: 54.70,
            lon: 25.30,
            created_at: "2023-01-01",
          },
          {
            id: "2",
            name: "Nauja vieta",
            lat: 54.688,
            lon: 25.280,
            created_at: "2024-01-01",
          },
        ],
      });

    render(<App />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("Ieškoti studijų vietos..."),
      "Vilnius"
    );

    await user.click(screen.getByRole("button", { name: "Ieškoti" }));

    const sortSelect = await screen.findByTestId("sort-select");

    await user.selectOptions(sortSelect, "newest");

    const results = await screen.findAllByRole("heading", { level: 3 });

    expect(results.map(r => r.textContent)).toEqual([
      "Nauja vieta",
      "Senesnė vieta",
    ]);
  });
});