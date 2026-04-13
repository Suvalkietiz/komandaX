type StudyPlaceFormInput = {
  name: string;
  address: string;
  wifiSpeed: "slow" | "fast" | "very_fast" | "";
  noiseLevel: "low" | "medium" | "high" | "";
  powerAvailability: "insufficient" | "sufficient" | "";
  placeType: "cafe" | "bar" | "restaurant" | "library" | "other" | "";
  workingHours: string;
};

type StudyPlaceResponse = {
  name?: string;
  address?: string;
  osm_id?: string;
  lat?: number;
  lon?: number;
  verified?: boolean;
  wifi_speed?: string;
  noise_level?: string;
  power_availability?: string;
  place_type?: string;
  working_hours?: string;
  created_at?: string;
};

type StudyPlaceDetailsResponse = {
  id: number;
  name: string;
  address: string;
  osm_id: string;
  lat: number;
  lon: number;
  verified: boolean;
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  place_type: string;
  working_hours: string;
  created_at: string;
};

export type StudyPlaceMapItem = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lon: number | null;
  verified: boolean;
  wifi_speed: string;
  noise_level: string;
  has_outlets: boolean;
};

export async function getStudyPlaces(): Promise<StudyPlaceMapItem[]> {
  const response = await fetch("/api/study-places");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to load study places.");
  }

  return response.json();
}

export async function getStudyPlaceById(id: string): Promise<StudyPlaceDetailsResponse> {
  const response = await fetch(`/api/study-places/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to load study place.");
  }

  return response.json();
}

export async function createStudyPlace(data: StudyPlaceFormInput): Promise<StudyPlaceResponse> {
  const response = await fetch("/api/study-places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save study place.");
  }

  return response.json();
}
