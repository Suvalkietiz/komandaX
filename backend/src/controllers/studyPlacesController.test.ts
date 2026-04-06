import type { Request, Response } from "express";
import { create } from "./studyPlacesController";
import * as osmValidationService from "../services/osmValidationService";
import * as studyPlacesService from "../services/studyPlacesService";

jest.mock("../services/osmValidationService");
jest.mock("../services/studyPlacesService");

describe("studyPlacesController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      body: {
        name: "Test Cafe",
        address: "Vilnius, Lithuania",
        wifiSpeed: "fast",
        noiseLevel: "quiet",
        powerAvailability: "yes",
        placeType: "cafe",
        workingHours: "9-17"
      }
    };

    mockRes = {
      status: statusMock
    };
  });

  describe("create", () => {
    it("should return 400 when missing required fields", async () => {
      mockReq.body = {
        name: "Test Cafe"
        // Missing all other fields
      };

      await create(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "All fields are required." });
      expect(osmValidationService.validatePublicStudyPlace).not.toHaveBeenCalled();
    });

    it("should extract osmId from validation and pass it to createStudyPlace", async () => {
      const mockValidationResult = {
        osmId: "123456",
        lat: 54.687,
        lon: 25.279
      };

      (osmValidationService.validatePublicStudyPlace as jest.Mock).mockResolvedValue(
        mockValidationResult
      );

      const mockCreatedPlace = {
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
      };

      (studyPlacesService.createStudyPlace as jest.Mock).mockResolvedValue(mockCreatedPlace);

      await create(mockReq as Request, mockRes as Response);

      expect(studyPlacesService.createStudyPlace).toHaveBeenCalledWith({
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
      });

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockCreatedPlace);
    });

    it("should return 400 when missing required fields", async () => {
      mockReq.body = {
        name: "Test Cafe"
        // Missing all other fields
      };

      await create(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "All fields are required." });
      expect(osmValidationService.validatePublicStudyPlace).not.toHaveBeenCalled();
    });

    it("should return 400 when validation fails with PUBLIC_STUDY_PLACE_ERROR", async () => {
      (osmValidationService.validatePublicStudyPlace as jest.Mock).mockRejectedValue(
        new Error(osmValidationService.PUBLIC_STUDY_PLACE_ERROR)
      );

      await create(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: osmValidationService.PUBLIC_STUDY_PLACE_ERROR
      });
    });

    it("should return 500 when database error occurs", async () => {
      const mockValidationResult = {
        osmId: "123456",
        lat: 54.687,
        lon: 25.279
      };

      (osmValidationService.validatePublicStudyPlace as jest.Mock).mockResolvedValue(
        mockValidationResult
      );

      (studyPlacesService.createStudyPlace as jest.Mock).mockRejectedValue(
        new Error("Database connection failed")
      );

      await create(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Failed to save study place." });
    });

    it("should set verified to true for newly created places", async () => {
      const mockValidationResult = {
        osmId: "789",
        lat: 54.5,
        lon: 25.0
      };

      (osmValidationService.validatePublicStudyPlace as jest.Mock).mockResolvedValue(
        mockValidationResult
      );

      (studyPlacesService.createStudyPlace as jest.Mock).mockResolvedValue({
        id: "1",
        verified: true
      });

      await create(mockReq as Request, mockRes as Response);

      const callArgs = (studyPlacesService.createStudyPlace as jest.Mock).mock
        .calls[0][0];
      expect(callArgs.verified).toBe(true);
    });
  });
});
