/** @jest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("Integration: filters flow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("filters study places by wifi speed", async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: "54.6872", lon: "25.2797" }],
      })
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: "1",
            name: "Greita kavinė",
            lat: 54.6872,
            lon: 25.2797,
            wifi_speed: "fast",
            place_type: "cafe",
          },
          {
            id: "2",
            name: "Lėta vieta",
            lat: 54.6872,
            lon: 25.2797,
            wifi_speed: "slow",
            place_type: "cafe",
          },
        ],
      });

    global.fetch = fetchMock as any;

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Ieškoti studijų vietos..."), "Vilnius");
    await user.selectOptions(screen.getByLabelText(/WiFi/i), "fast");
    await user.click(screen.getByRole("button", { name: "Ieškoti" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(await screen.findByText("Greita kavinė")).toBeInTheDocument();
    expect(screen.queryByText("Lėta vieta")).not.toBeInTheDocument();
  });

  it("filters study places by noise level", async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: "54.6872", lon: "25.2797" }],
      })
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: "1",
            name: "Tylu",
            lat: 54.6872,
            lon: 25.2797,
            noise_level: "low",
          },
          {
            id: "2",
            name: "Triukšminga",
            lat: 54.6872,
            lon: 25.2797,
            noise_level: "high",
          },
        ],
      });

    global.fetch = fetchMock as any;

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Ieškoti studijų vietos..."), "Vilnius");
    await user.selectOptions(screen.getByLabelText(/Noise/i), "low");
    await user.click(screen.getByRole("button", { name: "Ieškoti" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(await screen.findByText("Tylu")).toBeInTheDocument();
    expect(screen.queryByText("Triukšminga")).not.toBeInTheDocument();
  });

  it("shows all places when no filter selected", async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: "54.6872", lon: "25.2797" }],
      })
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: "1",
            name: "Pirma vieta",
            lat: 54.6872,
            lon: 25.2797,
            wifi_speed: "fast",
          },
          {
            id: "2",
            name: "Antra vieta",
            lat: 54.6872,
            lon: 25.2797,
            wifi_speed: "slow",
          },
        ],
      });

    global.fetch = fetchMock as any;

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Ieškoti studijų vietos..."), "Vilnius");
    await user.click(screen.getByRole("button", { name: "Ieškoti" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(await screen.findByText("Pirma vieta")).toBeInTheDocument();
    expect(await screen.findByText("Antra vieta")).toBeInTheDocument();
  });
});