import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewStudyPlace } from "./NewStudyPlace";

function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  return Promise.all([
    user.selectOptions(screen.getByLabelText(/wifi speed/i), "fast"),
    user.selectOptions(screen.getByLabelText(/noise level/i), "low"),
    user.selectOptions(
      screen.getByLabelText(/power outlet availability/i),
      "sufficient"
    ),
    user.selectOptions(screen.getByLabelText(/place type/i), "cafe"),
    user.type(screen.getByLabelText(/working hours/i), "09:00")
  ]);
}

describe("NewStudyPlace", () => {
  it("posts form values and renders submitted summary (snake_case mapping)", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        wifi_speed: "very_fast",
        noise_level: "medium",
        power_availability: "sufficient",
        place_type: "library",
        working_hours: "10:30"
      })
    });
    vi.stubGlobal("fetch", fetchMock as any);

    render(<NewStudyPlace />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /save study place/i }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/study-places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wifiSpeed: "fast",
        noiseLevel: "low",
        powerAvailability: "sufficient",
        placeType: "cafe",
        workingHours: "09:00"
      })
    });

    const heading = await screen.findByRole("heading", {
      name: /study place summary/i
    });
    const summary = heading.closest(".result");
    expect(summary).not.toBeNull();

    const scoped = within(summary!);
    expect(scoped.getByText("very_fast")).toBeInTheDocument();
    expect(scoped.getByText("medium")).toBeInTheDocument();
    expect(scoped.getByText("sufficient")).toBeInTheDocument();
    expect(scoped.getByText("library")).toBeInTheDocument();
    expect(scoped.getByText("10:30")).toBeInTheDocument();
  });

  it("shows an error message when API returns non-ok response", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Nope" })
    });
    vi.stubGlobal("fetch", fetchMock as any);

    render(<NewStudyPlace />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /save study place/i }));

    expect(await screen.findByText("Nope")).toBeInTheDocument();
  });

  it("disables repeat submission UI while saving", async () => {
    const user = userEvent.setup();

    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((res) => {
      resolveFetch = res;
    });
    const fetchMock = vi.fn().mockReturnValue(fetchPromise);
    vi.stubGlobal("fetch", fetchMock as any);

    render(<NewStudyPlace />);
    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: /save study place/i }));

    expect(
      await screen.findByRole("button", { name: /saving/i })
    ).toBeInTheDocument();

    resolveFetch!({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /save study place/i })
      ).toBeInTheDocument();
    });
  });
});

