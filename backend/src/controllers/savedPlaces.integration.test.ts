import express from "express";
import request from "supertest";
import { savePlace, getSavedPlaces, removeSavedPlace } from "./savedPlacesController";
import { db as pool } from "../db/db";

jest.mock("../db/db", () => ({
  db: {
    query: jest.fn(),
  },
}));

describe("SavedPlaces Integration Tests", () => {
  const mockedPool = pool as unknown as { query: jest.Mock };
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/api/saved-places", savePlace);
    app.get("/api/saved-places", getSavedPlaces);
    app.delete("/api/saved-places/:savedPlaceId", removeSavedPlace);
    jest.clearAllMocks();
  });

  it("saves a place and returns 201", async () => {
    mockedPool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 11, user_id: 1, study_place_id: 1 }] });

    const response = await request(app)
      .post("/api/saved-places")
      .send({
        studyPlaceId: 1,
        place: {
          id: 1,
          name: "Testinė biblioteka",
          address: "Vilnius, Lietuva",
          wifi_speed: "fast",
          noise_level: "quiet",
          power_availability: "yes",
          has_outlets: true,
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Place saved successfully.");
    expect(response.body.data).toEqual({ id: 11, user_id: 1, study_place_id: 1 });
  });

  it("returns 409 when the place is already saved", async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [{ id: 11 }] });

    const response = await request(app)
      .post("/api/saved-places")
      .send({
        studyPlaceId: 1,
        place: { name: "Testinė biblioteka", address: "Vilnius" },
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Place is already saved.");
  });

  it("returns 400 when studyPlaceId is missing", async () => {
    const response = await request(app).post("/api/saved-places").send({
      place: { name: "Test", address: "Vilnius" },
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("studyPlaceId is required.");
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it("returns saved places with joined place data", async () => {
    mockedPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 5,
          userId: 1,
          studyPlaceId: 1,
          placeId: 1,
          placeName: "Testinė biblioteka",
          placeAddress: "Vilnius",
          placeWifiSpeed: "fast",
          placeNoiseLevel: "quiet",
          placePowerAvailability: "yes",
        },
      ],
    });

    const response = await request(app).get("/api/saved-places");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 5,
        userId: 1,
        studyPlaceId: 1,
        place: {
          id: 1,
          name: "Testinė biblioteka",
          address: "Vilnius",
          wifi_speed: "fast",
          noise_level: "quiet",
          power_availability: "yes",
        },
      },
    ]);
  });

  it("removes a saved place and returns 200", async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [{ id: 5, user_id: 1, study_place_id: 1 }] });

    const response = await request(app).delete("/api/saved-places/5");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Place removed successfully.");
    expect(response.body.data).toEqual({ id: 5, user_id: 1, study_place_id: 1 });
  });
});
