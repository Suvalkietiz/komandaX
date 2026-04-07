import { getById } from "./studyPlacesController";
import * as studyPlacesService from "../services/studyPlacesService";

jest.mock("../services/studyPlacesService");

describe("studyPlacesController check-info", () => {
  let mockReq: any;
  let mockRes: any;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = { params: { id: "1" } };
    mockRes = { status: statusMock };
  });

  it("calls service to fetch study place by id", async () => {
    (studyPlacesService.getStudyPlaceById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Test Place",
      address: "Vilnius"
    });

    await getById(mockReq, mockRes);

    expect(studyPlacesService.getStudyPlaceById).toHaveBeenCalledWith(1);
  });

  it("returns 200 with place when data is found", async () => {
    const place = {
      id: 1,
      name: "Test Place",
      address: "Vilnius"
    };

    (studyPlacesService.getStudyPlaceById as jest.Mock).mockResolvedValue(place);

    await getById(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(place);
  });

  it("returns 404 when no place data is found", async () => {
    (studyPlacesService.getStudyPlaceById as jest.Mock).mockResolvedValue(null);

    await getById(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Study place not found." });
  });
});