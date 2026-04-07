import { db } from "../db/db";
import { getStudyPlaceById } from "./studyPlacesService";

jest.mock("../db/db");

describe("studyPlacesService check-info", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches study place from DB by id", async () => {
    const place = {
      id: 3,
      name: "Library",
      address: "Kaunas",
      osm_id: "123",
      lat: 54.9,
      lon: 23.9,
      verified: true,
      wifi_speed: "fast",
      noise_level: "quiet",
      power_availability: "yes",
      place_type: "library",
      working_hours: "8-20",
      created_at: new Date().toISOString()
    };

    (db.query as jest.Mock).mockResolvedValue({ rows: [place] });

    const result = await getStudyPlaceById(3);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1"), [3]);
    expect(result).toEqual(place);
  });

  it("returns null when DB has no place data", async () => {
    (db.query as jest.Mock).mockResolvedValue({ rows: [] });

    const result = await getStudyPlaceById(999);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1"), [999]);
    expect(result).toBeNull();
  });
});