import React, { useState, useEffect } from 'react';
import { getSavedPlaces, removeSavedPlace } from '../services/savedPlacesService';
import StudySpaceCard from './StudySpaceCard';
import ReviewForm from './ReviewForm';

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
  const [reviewPlaceId, setReviewPlaceId] = useState<number | null>(null);

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

  const handleRemove = async (savedPlaceId: number) => {
    try {
      await removeSavedPlace(savedPlaceId);
      setSavedPlaces(prev => prev.filter(p => p.id !== savedPlaceId));
      alert('Vieta pašalinta iš išsaugotų');
    } catch (err) {
      console.error(err);
      alert('Nepavyko pašalinti vietos');
    }
  };

  if (loading) {
    return <div className="saved-status-box">Kraunama išsaugotos vietos...</div>;
  }

  if (error) {
    return <div className="saved-status-box saved-status-error">{error}</div>;
  }

  if (!savedPlaces.length) {
    return (
      <div className="saved-status-box saved-status-empty">
        Jūs neturite išsaugotų vietų.
      </div>
    );
  }

  return (
    <main className="saved-page">
      <section className="saved-header">
        <h1>Išsaugotos vietos</h1>
        <p>Greita prieiga prie tavo mėgstamų mokymosi vietų.</p>
      </section>

      <section className="saved-grid">
        {savedPlaces.map((saved) => {
          const place = saved.place ?? {
            id: saved.studyPlaceId,
            name: `Išsaugota vieta #${saved.studyPlaceId}`,
            address: 'Adresas nenurodytas',
            wifi_speed: 'Nežinoma',
            noise_level: 'Nežinomas',
            has_outlets: false,
          };

          return (
            <article key={saved.id} className="saved-item">
              <StudySpaceCard
                id={place.id}
                name={place.name}
                address={place.address}
                wifi_speed={place.wifi_speed ?? 'Nežinoma'}
                noise_level={place.noise_level ?? 'Nežinomas'}
                has_outlets={
                  typeof place.has_outlets === 'boolean'
                    ? place.has_outlets
                    : ['yes', 'yra', 'sufficient', 'true'].includes(
                        (place.power_availability ?? '').toLowerCase()
                      )
                }
                distance_km={0} // Not relevant for saved places
              />
              <div className="saved-actions">
                <button
                  type="button"
                  onClick={() => setReviewPlaceId(saved.studyPlaceId)}
                  className="saved-action-button"
                >
                  Įvertinti vietą
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(saved.id)}
                  className="saved-action-button saved-action-danger"
                >
                  Pašalinti iš išsaugotų
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {reviewPlaceId !== null && (
        <div className="saved-modal-overlay">
          <div className="saved-modal-card">
            <button type="button" className="saved-modal-close" onClick={() => setReviewPlaceId(null)}>Uzdaryti</button>
            <ReviewForm studyPlaceId={reviewPlaceId} />
          </div>
        </div>
      )}
    </main>
  );
};

export default SavedPlaces;