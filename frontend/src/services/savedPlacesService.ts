export type SavedPlaceSnapshot = {
  id: number | string;
  name: string;
  address: string;
  wifi_speed?: string;
  noise_level?: string;
  power_availability?: string;
  has_outlets?: boolean;
};

export type SavedPlaceRecord = {
  id: number;
  userId: number;
  studyPlaceId: number;
  place?: SavedPlaceSnapshot;
};

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  const raw = await response.text();
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as { error?: string };
    return parsed.error || fallback;
  } catch {
    return fallback;
  }
}

export async function savePlace(studyPlaceId: number | string, place?: SavedPlaceSnapshot): Promise<void> {
  const response = await fetch('/api/saved-places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studyPlaceId, place }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to save place'));
  }
}

export async function getSavedPlaces(): Promise<SavedPlaceRecord[]> {
  const response = await fetch('/api/saved-places');

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to fetch saved places'));
  }

  const data = await response.json();
  return data.data || [];
}

export async function removeSavedPlace(studyPlaceId: number | string): Promise<void> {
  const response = await fetch(`/api/saved-places/${studyPlaceId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to remove saved place'));
  }
}

