import { useNavigate } from "react-router-dom";

type Place = {
  id: number;
  avg_rating: number;
  wifi_speed: string;
  noise_level: string;
  place_type: string;
  power_availability: string;
  working_hours: string;
  created_at: string;
};

type Props = { places: Place[] };

export function StudyPlacesList({ places }: Props) {
  const navigate = useNavigate();

  return (
    <div>
      {places.map((p) => (
        <div key={p.id} className="place-card">
          <h3>{p.place_type}</h3>
          <p>rating: {p.avg_rating}</p>
          <p>WiFi speed: {p.wifi_speed}</p>
          <p>Noise level: {p.noise_level}</p>
          <p>Power availability: {p.power_availability}</p>
          <p>Working hours: {p.working_hours}</p>
          <p>Created: {p.created_at}</p>
          <button
            type="button"
            onClick={() => navigate(`/study-place/${p.id}`)}
            className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            Peržiūrėti ir įvertinti
          </button>
        </div>
      ))}
    </div>
  );
}