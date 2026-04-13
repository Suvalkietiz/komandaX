/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FiltersPanel } from "./FiltersPanel";

describe("FiltersPanel", () => {
  const mockFilters = {
    wifi_speed: "",
    noise_level: "",
    place_type: "",
    power_availability: "",
    working_hours: "",
  };

  it("renders all select inputs", () => {
    render(<FiltersPanel filters={mockFilters} onChange={() => {}} />);

    expect(screen.getByLabelText(/WiFi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Noise/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Power/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Working hours/i)).toBeInTheDocument();
  });

  it("calls onChange when WiFi filter changes", async () => {
    const onChangeMock = jest.fn();

    render(
      <FiltersPanel filters={mockFilters} onChange={onChangeMock} />
    );

    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/WiFi/i), "fast");

    expect(onChangeMock).toHaveBeenCalledWith({
      ...mockFilters,
      wifi_speed: "fast",
    });
  });
});