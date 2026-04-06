const NOMINATIM_USER_AGENT = "komandaX-study-places/1.0";

export const PUBLIC_STUDY_PLACE_ERROR = "Ši vieta nėra atpažįstama kaip vieša studijų erdvė";

const ALLOWED_AMENITY_TYPES = new Set([
	"cafe",
	"library",
	"university",
	"college",
	"school",
	"community_centre",
	"arts_centre",
]);

type NominatimSearchResult = {
	lat: string;
	lon: string;
};

type NominatimReverseResult = {
	category?: string;
	type?: string;
};

export type ValidatedStudyPlaceLocation = {
	lat: number;
	lon: number;
};

function isPublicStudyPlace(category?: string, type?: string): boolean {
	return category === "amenity" && typeof type === "string" && ALLOWED_AMENITY_TYPES.has(type);
}

async function geocodeAddress(address: string): Promise<ValidatedStudyPlaceLocation | null> {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`,
		{
			headers: {
				"User-Agent": NOMINATIM_USER_AGENT,
				"Accept-Language": "en"
			}
		}
	);

	const results = (await response.json()) as NominatimSearchResult[];

	if (!results.length) {
		return null;
	}

	return {
		lat: Number.parseFloat(results[0].lat),
		lon: Number.parseFloat(results[0].lon)
	};
}

async function reverseGeocode(lat: number, lon: number): Promise<NominatimReverseResult | null> {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&extratags=1&layer=poi,address`,
		{
			headers: {
				"User-Agent": NOMINATIM_USER_AGENT,
				"Accept-Language": "en"
			}
		}
	);

	if (!response.ok) {
		return null;
	}

	return (await response.json()) as NominatimReverseResult;
}

export async function validatePublicStudyPlace(address: string): Promise<ValidatedStudyPlaceLocation> {
	const coordinates = await geocodeAddress(address);

	if (!coordinates) {
		throw new Error(PUBLIC_STUDY_PLACE_ERROR);
	}

	const reverseResult = await reverseGeocode(coordinates.lat, coordinates.lon);

	if (!reverseResult || !isPublicStudyPlace(reverseResult.category, reverseResult.type)) {
		throw new Error(PUBLIC_STUDY_PLACE_ERROR);
	}

	return coordinates;
}
