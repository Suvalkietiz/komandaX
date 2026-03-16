type Place = {
  id: number;
  wifi_speed: string;
  noise_level: string;
  place_type: string;
  power_availability: string;
  working_hours: string;
  created_at: string;
};

type Props = { places: Place[] };

export function StudyPlacesList({ places }: Props) {
  return (
    <div>
      {places.map((p) => (
        <div key={p.id} className="place-card">
          <h3>{p.place_type}</h3>
          <p>WiFi speed: {p.wifi_speed}</p>
          <p>Noise level: {p.noise_level}</p>
          <p>Power availability: {p.power_availability}</p>
          <p>Working hours: {p.working_hours}</p>
        </div>
      ))}
    </div>
  );
}