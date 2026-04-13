import React, { useState, useEffect } from 'react';
import { getSavedPlaces, removeSavedPlace } from '../services/savedPlacesService';
import StudySpaceCard from './StudySpaceCard';

interface SavedPlace {
  id: number;
  userId: number;
  studyPlaceId: number;
  place?: {
    id: string | number;
    name: string;
    address: string;
    wifi_speed?: string;
    noise_level?: string;
    power_availability?: string;
    has_outlets?: boolean;
  };
}

const SavedPlaces: React.FC = () => {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
    try {
      setLoading(true);
      const data = await getSavedPlaces();
      setSavedPlaces(data);
    } catch (err) {
      setError('Nepavyko gauti išsaugotų vietų');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (studyPlaceId: number) => {
    try {
      await removeSavedPlace(studyPlaceId);
      setSavedPlaces(prev => prev.filter(p => p.studyPlaceId !== studyPlaceId));
      alert('Vieta pašalinta iš išsaugotų');
    } catch (err) {
      console.error(err);
      alert('Nepavyko pašalinti vietos');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Kraunama...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (!savedPlaces.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Jūs neturite išsaugotų vietų.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Išsaugotos vietos</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {savedPlaces.map((saved) => (
          saved.place ? (
            <div key={saved.id} className="flex flex-col gap-2">
              <StudySpaceCard
                name={saved.place.name}
                address={saved.place.address}
                wifi_speed={saved.place.wifi_speed ?? 'Nežinoma'}
                noise_level={saved.place.noise_level ?? 'Nežinomas'}
                has_outlets={
                  typeof saved.place.has_outlets === 'boolean'
                    ? saved.place.has_outlets
                    : saved.place.power_availability === 'yes'
                }
                distance_km={0} // Not relevant for saved places
              />
              <button
                onClick={() => handleRemove(saved.studyPlaceId)}
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Pašalinti iš išsaugotų
              </button>
            </div>
          ) : (
            <div key={saved.id} className="text-center text-gray-500">
              Vieta #{saved.studyPlaceId} nerasta
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SavedPlaces;