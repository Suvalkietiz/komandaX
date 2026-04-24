import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudyPlaceById } from "../services/studyPlacesService";

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

function valueOrUnknown(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Nenurodyta";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Nenurodyta"
    : date.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default function StudyPlaceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [place, setPlace] = useState<StudyPlaceDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Vietos identifikatorius nerastas.");
      setLoading(false);
      return;
    }

    async function loadPlace() {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudyPlaceById(id!);
        setPlace(data);
      } catch {
        setError("Nepavyko įkelti vietos informacijos.");
      } finally {
        setLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  if (loading) {
    return (
      <main className="place-details-page">
        <section className="place-details-card">
          <p className="place-loading">Kraunama vietos informacija...</p>
        </section>
      </main>
    );
  }

  if (error || !place) {
    return (
      <main className="place-details-page">
        <div className="place-details-container">
          <button className="place-back-button" onClick={() => navigate(-1)}>
            ← Grįžti atgal
          </button>

          <section className="place-details-card">
            <h1>Vietos informacija nerasta</h1>
            <p className="place-error">{error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="place-details-page">
      <div className="place-details-container">
        <button className="place-back-button" onClick={() => navigate(-1)}>
          ← Grįžti atgal
        </button>

        <section className="place-hero">
          <div>
            <p className="place-type">{valueOrUnknown(place.place_type)}</p>
            <h1>{place.name}</h1>
            <p className="place-address">{place.address}</p>
          </div>

          <span className={place.verified ? "place-badge verified" : "place-badge"}>
            {place.verified ? "Patikrinta vieta" : "Nepatikrinta vieta"}
          </span>
        </section>

        <section className="place-info-grid">
          <article className="place-info-card">
            <span>🕒</span>
            <h2>Darbo laikas</h2>
            <p>{valueOrUnknown(place.working_hours)}</p>
          </article>

          <article className="place-info-card">
            <span>📶</span>
            <h2>Wi-Fi</h2>
            <p>{valueOrUnknown(place.wifi_speed)}</p>
          </article>

          <article className="place-info-card">
            <span>🔇</span>
            <h2>Triukšmo lygis</h2>
            <p>{valueOrUnknown(place.noise_level)}</p>
          </article>

          <article className="place-info-card">
            <span>🔌</span>
            <h2>Elektros lizdai</h2>
            <p>{valueOrUnknown(place.power_availability)}</p>
          </article>
        </section>

        <section className="place-details-card">
          <h2>Papildoma informacija</h2>

          <div className="place-details-list">
            <div>
              <span>Adresas</span>
              <strong>{valueOrUnknown(place.address)}</strong>
            </div>

            <div>
              <span>Vietos tipas</span>
              <strong>{valueOrUnknown(place.place_type)}</strong>
            </div>

            <div>
              <span>Koordinatės</span>
              <strong>
                {place.lat}, {place.lon}
              </strong>
            </div>

            <div>
              <span>Pridėta</span>
              <strong>{formatDate(place.created_at)}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}