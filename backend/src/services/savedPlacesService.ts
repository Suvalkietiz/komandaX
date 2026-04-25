const API_URL = "http://localhost:3000/api";

export const savePlace = async (studyPlaceId: number) => {
  const response = await fetch(`${API_URL}/saved-places`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studyPlaceId }),
  });

  if (!response.ok) {
    throw new Error("Failed to save place");
  }

  return response.json();
};

export const getSavedPlaces = async () => {
  const response = await fetch(`${API_URL}/saved-places`);

  if (!response.ok) {
    throw new Error("Failed to fetch saved places");
  }

  return response.json();
};

export const removeSavedPlace = async (studyPlaceId: number) => {
  const response = await fetch(`${API_URL}/saved-places/${studyPlaceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove saved place");
  }

  return response.json();
};