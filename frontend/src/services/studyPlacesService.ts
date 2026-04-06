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
  wifi_speed?: string;
  noise_level?: string;
  power_availability?: string;
  place_type?: string;
  working_hours?: string;
};

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
