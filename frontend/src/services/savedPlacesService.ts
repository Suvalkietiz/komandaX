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

function toNetworkErrorMessage(err: unknown, fallback: string): Error {
  if (err instanceof Error && err.message.toLowerCase().includes('failed to fetch')) {
    return new Error('Backend API nepasiekiamas. Patikrink, ar paleistas backend serveris (localhost:3000).');
  }

  if (err instanceof Error) {
    return err;
  }

  return new Error(fallback);
}

export async function savePlace(studyPlaceId: number | string, place?: SavedPlaceSnapshot): Promise<void> {
  try {
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
  } catch (err) {
    throw toNetworkErrorMessage(err, 'Failed to save place');
  }
}

export async function getSavedPlaces(): Promise<SavedPlaceRecord[]> {
  const response = await fetch('/api/saved-places');

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to fetch saved places'));
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return data as SavedPlaceRecord[];
  }

  return (data?.data as SavedPlaceRecord[]) || [];
}

export async function removeSavedPlace(savedPlaceId: number | string): Promise<void> {
  const response = await fetch(`/api/saved-places/${savedPlaceId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to remove saved place'));
  }
}

