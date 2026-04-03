import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("calls onChange when a filter changes", () => {
    const onChangeMock = vi.fn();
    render(<FiltersPanel filters={mockFilters} onChange={onChangeMock} />);
    
    fireEvent.change(screen.getByLabelText(/WiFi/i), { target: { value: "fast" } });
    expect(onChangeMock).toHaveBeenCalledWith({
      ...mockFilters,
      wifi_speed: "fast",
    });
  });
});