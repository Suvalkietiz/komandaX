import { calculateDistance, getFilteredPlaces } from "./calculateDistance";

describe("calculateDistance", () => {
  it("calculates correct distance between Vilnius Cathedral and Akropolis", () => {
    // Vilnius Cathedral: 54.6869, 25.2873
    // Akropolis Vilnius: 54.7009, 25.2637
    // Actual distance ≈ 2.17 km (Haversine)
    const dist = calculateDistance(54.6869, 25.2873, 54.7009, 25.2637);
    expect(dist).toBeGreaterThan(2.15);
    expect(dist).toBeLessThan(2.2);
  });
});

describe("getFilteredPlaces", () => {
  const userLat = 54.6869;
  const userLon = 25.2873;
  const places = [
    { name: "Akropolis", lat: 54.7009, lon: 25.2637 }, // ~1.9km
    { name: "Kaunas", lat: 54.8985, lon: 23.9036 }, // ~92km
  ];

  it("returns only places within 2.2km (Case A)", () => {
    const filtered = getFilteredPlaces(places, userLat, userLon, 2.2);
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe("Akropolis");
    expect(filtered[0].distance).toBeGreaterThan(2.15);
    expect(filtered[0].distance).toBeLessThan(2.2);
    expect(filtered[0].distanceFormatted).toMatch(/km$/);
  });

  it("returns empty array if no places within 2km (Case B)", () => {
    const filtered = getFilteredPlaces(places, userLat, userLon, 0.5);
    expect(filtered).toEqual([]);
  });

  it("sorts places by distance and formats distance", () => {
    // Add a closer place
    const morePlaces = [
      { name: "Closer", lat: 54.6870, lon: 25.2874 }, // ~0.01km
      ...places,
    ];
    const filtered = getFilteredPlaces(morePlaces, userLat, userLon, 2.2);
    expect(filtered[0].name).toBe("Closer");
    expect(filtered[1].name).toBe("Akropolis");
    expect(filtered.every((p) => typeof p.distance === "number")).toBe(true);
    expect(filtered.every((p) => typeof p.distanceFormatted === "string")).toBe(true);
  });
});
