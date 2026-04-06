import { PUBLIC_STUDY_PLACE_ERROR, validatePublicStudyPlace } from "./osmValidationService";

describe("validatePublicStudyPlace", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("returns coordinates for a public study space", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: "54.6871", lon: "25.2875" }]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ category: "amenity", type: "library" })
      });

    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(validatePublicStudyPlace("Gedimino pr. 1, Vilnius")).resolves.toEqual({
      lat: 54.6871,
      lon: 25.2875
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws the public study space error for private or unknown places", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: "54.7000", lon: "25.3000" }]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ category: "building", type: "house" })
      });

    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(validatePublicStudyPlace("Privatus namas")).rejects.toThrow(PUBLIC_STUDY_PLACE_ERROR);
  });

  it("throws the public study space error when geocoding finds nothing", async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      json: async () => []
    });

    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(validatePublicStudyPlace("Neatpažįstama vieta")).rejects.toThrow(PUBLIC_STUDY_PLACE_ERROR);
  });

  it("throws the public study space error when geocoding returns malformed coordinates", async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      json: async () => [{ lat: "not-a-number", lon: "25.3000" }]
    });

    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(validatePublicStudyPlace("Sugadinta koordinatė")).rejects.toThrow(PUBLIC_STUDY_PLACE_ERROR);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
