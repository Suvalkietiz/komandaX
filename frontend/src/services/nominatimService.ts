type NominatimSearchResult = {
  lat: string;
  lon: string;
};

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lon: number } | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = (await response.json()) as NominatimSearchResult[];

  if (!data.length) {
    return null;
  }

  const { lat, lon } = data[0];

  return {
    lat: Number.parseFloat(lat),
    lon: Number.parseFloat(lon),
  };
}
