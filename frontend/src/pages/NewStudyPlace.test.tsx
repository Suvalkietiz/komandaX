/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//import { vi } from "vitest"; vi >>>> jest
import { NewStudyPlace } from "./NewStudyPlace";
import { createStudyPlace } from "../services/studyPlacesService";

jest.mock("../services/studyPlacesService", () => ({
  createStudyPlace: jest.fn(),
}));

describe("NewStudyPlace", () => {
  it("shows the validation error returned by the backend", async () => {
    jest.mocked(createStudyPlace).mockRejectedValueOnce(
      new Error("Ši vieta nėra atpažįstama kaip vieša studijų erdvė")
    );

    render(<NewStudyPlace />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Place name/i), "Test Place");
    await user.type(screen.getByLabelText(/Address/i), "Gedimino pr. 1, Vilnius");
    await user.selectOptions(screen.getByLabelText(/WiFi speed/i), "fast");
    await user.selectOptions(screen.getByLabelText(/Noise level/i), "low");
    await user.selectOptions(screen.getByLabelText(/Power outlet availability/i), "sufficient");
    await user.selectOptions(screen.getByLabelText(/Place type/i), "cafe");
    await user.type(screen.getByLabelText(/Working hours/i), "09:00");

    await user.click(screen.getByRole("button", { name: /save study place/i }));

    expect(
      await screen.findByText("Ši vieta nėra atpažįstama kaip vieša studijų erdvė")
    ).toBeInTheDocument();
  });
});
