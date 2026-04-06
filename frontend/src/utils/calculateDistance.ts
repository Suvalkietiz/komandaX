// Haversine formula to calculate distance between two lat/lon points in kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Filters and sorts places by distance from a given point, within a maxDistance (km)
export function getFilteredPlaces(
  places: Array<{ lat: number; lon: number; [key: string]: any }>,
  userLat: number,
  userLon: number,
  maxDistance: number = 2
): Array<{ distance: number; distanceFormatted: string; [key: string]: any }> {
  return places
    .map((place) => {
      const distance = calculateDistance(userLat, userLon, place.lat, place.lon);
      return {
        ...place,
        distance,
        distanceFormatted: `${distance.toFixed(1)} km`,
      };
    })
    .filter((place) => place.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}
