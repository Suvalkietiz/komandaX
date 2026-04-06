import { createStudyPlace } from "./studyPlacesService";
import { db } from "../db/db";
import type { StudyPlace } from "../models/studyPlace";

jest.mock("../db/db");

describe("studyPlacesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createStudyPlace", () => {
    it("should include osmId in INSERT statement", async () => {
      const mockResult = {
        rows: [
          {
            id: "1",
            name: "Test Cafe",
            address: "Vilnius, Lithuania",
            osm_id: "123456",
            lat: 54.687,
            lon: 25.279,
            verified: true,
            wifi_speed: "fast",
            noise_level: "quiet",
            power_availability: "yes",
            place_type: "cafe",
            working_hours: "9-17",
            created_at: new Date()
          }
        ]
      };

      (db.query as jest.Mock).mockResolvedValue(mockResult);

      const input = {
        name: "Test Cafe",
        address: "Vilnius, Lithuania",
        osmId: "123456",
        lat: 54.687,
        lon: 25.279,
        verified: true,
        wifiSpeed: "fast",
        noiseLevel: "quiet",
        powerAvailability: "yes",
        placeType: "cafe",
        workingHours: "9-17"
      };

      const result = await createStudyPlace(input);

      // Verify query was called with correct SQL including osm_id
      expect(db.query).toHaveBeenCalled();
      const callArgs = (db.query as jest.Mock).mock.calls[0];
      const sql = callArgs[0];
      const params = callArgs[1];

      expect(sql).toContain("osm_id");
      expect(sql).toContain("VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)");
      expect(params).toContain("123456");
      expect(result.osm_id).toBe("123456");
    });

    it("should map all fields correctly to query parameters", async () => {
      const mockResult = {
        rows: [
          {
            id: "1",
            name: "Test Cafe",
            address: "Vilnius, Lithuania",
            osm_id: "999",
            lat: 54.1,
            lon: 25.2,
            verified: true,
            wifi_speed: "slow",
            noise_level: "loud",
            power_availability: "no",
            place_type: "library",
            working_hours: "8-18",
            created_at: new Date()
          }
        ]
      };

      (db.query as jest.Mock).mockResolvedValue(mockResult);

      const input = {
        name: "Test Library",
        address: "Vilnius, Lithuania",
        osmId: "999",
        lat: 54.1,
        lon: 25.2,
        verified: true,
        wifiSpeed: "slow",
        noiseLevel: "loud",
        powerAvailability: "no",
        placeType: "library",
        workingHours: "8-18"
      };

      await createStudyPlace(input);

      const params = (db.query as jest.Mock).mock.calls[0][1];

      // Verify parameters in order: name, address, osmId, lat, lon, verified, wifiSpeed, noiseLevel, powerAvailability, placeType, workingHours
      expect(params).toEqual([
        "Test Library",
        "Vilnius, Lithuania",
        "999",
        54.1,
        25.2,
        true,
        "slow",
        "loud",
        "no",
        "library",
        "8-18"
      ]);
    });

    it("should return the created study place with osm_id", async () => {
      const createdPlace: StudyPlace = {
        id: 5,
        name: "Test Cafe",
        address: "Vilnius, Lithuania",
        osm_id: "555",
        lat: 54.687,
        lon: 25.279,
        verified: true,
        wifi_speed: "fast",
        noise_level: "quiet",
        power_availability: "yes",
        place_type: "cafe",
        working_hours: "9-17",
        created_at: new Date().toISOString()
      };

      (db.query as jest.Mock).mockResolvedValue({
        rows: [createdPlace]
      });

      const input = {
        name: "Test Cafe",
        address: "Vilnius, Lithuania",
        osmId: "555",
        lat: 54.687,
        lon: 25.279,
        verified: true,
        wifiSpeed: "fast",
        noiseLevel: "quiet",
        powerAvailability: "yes",
        placeType: "cafe",
        workingHours: "9-17"
      };

      const result = await createStudyPlace(input);

      expect(result).toEqual(createdPlace);
      expect(result.osm_id).toBe("555");
      expect(result.id).toBe(5);
    });

    it("should include osm_id in RETURNING clause", async () => {
      const mockResult = {
        rows: [
          {
            id: "1",
            osm_id: "123"
          }
        ]
      };

      (db.query as jest.Mock).mockResolvedValue(mockResult);

      await createStudyPlace({
        name: "Test",
        address: "Test Address",
        osmId: "123",
        lat: 54,
        lon: 25,
        verified: true,
        wifiSpeed: "fast",
        noiseLevel: "quiet",
        powerAvailability: "yes",
        placeType: "cafe",
        workingHours: "9-17"
      });

      const sql = (db.query as jest.Mock).mock.calls[0][0];
      expect(sql).toContain("RETURNING");
      expect(sql).toContain("osm_id");
    });
  });
});
