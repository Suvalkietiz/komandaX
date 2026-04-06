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
        const data = await getStudyPlaceById(id!);
        setPlace(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Nepavyko įkelti vietos informacijos.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center text-blue-600">Kraunama vietos informacija...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <button
          type="button"
          className="text-blue-600 underline mb-4"
          onClick={() => navigate(-1)}
        >
          Grįžti atgal
        </button>
        <div className="text-red-600 mb-4">{error}</div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-4">
            Bandymas užkrauti duomenis iš duomenų bazės: <code>/api/study-places/{id}</code>
          </p>
          <p className="font-semibold mb-4">Sistemos logika įvykdyta — puslapis buvo atidarytas, bet duomenų bazėje gali nebūti atitinkamo įrašo.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 bg-gray-50">
              <h2 className="font-semibold mb-2">Vieta</h2>
              <p>Study place #{id}</p>
            </div>
            <div className="rounded-lg border p-4 bg-gray-50">
              <h2 className="font-semibold mb-2">Adresas</h2>
              <p>Nenurodytas</p>
            </div>
            <div className="rounded-lg border p-4 bg-gray-50">
              <h2 className="font-semibold mb-2">Wi-Fi</h2>
              <p>Nežinoma</p>
            </div>
            <div className="rounded-lg border p-4 bg-gray-50">
              <h2 className="font-semibold mb-2">Triukšmo lygis</h2>
              <p>Nežinomas</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <button
          type="button"
          className="text-blue-600 underline mb-4"
          onClick={() => navigate(-1)}
        >
          Grįžti atgal
        </button>
        <div className="text-gray-600">Vietos informacija nerasta.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        type="button"
        className="text-blue-600 underline mb-4"
        onClick={() => navigate(-1)}
      >
        Grįžti atgal
      </button>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={`https://via.placeholder.com/1200x450?text=${encodeURIComponent(place.name)}`}
            alt={place.name}
            className="w-full h-64 object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
        <p className="text-sm text-gray-500 mb-6">{place.address}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Vieta</h2>
            <p>{place.place_type}</p>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Darbo laikas</h2>
            <p>{place.working_hours}</p>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Wi-Fi</h2>
            <p>{place.wifi_speed}</p>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Triukšmo lygis</h2>
            <p>{place.noise_level}</p>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Elektros lizdai</h2>
            <p>{place.power_availability}</p>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Patikrinta</h2>
            <p>{place.verified ? "Taip" : "Ne"}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Išsami informacija</h2>
          <p>OSM ID: {place.osm_id}</p>
          <p>Longitude / Latitude: {place.lon}, {place.lat}</p>
          <p>Patvirtinimas: {place.verified ? "Taip" : "Ne"}</p>
          <p>Kurta: {new Date(place.created_at).toLocaleString("lt-LT")}</p>
          <p className="text-xs text-gray-500 mt-3">Duomenys užkrauti iš duomenų bazės.</p>
        </div>
      </div>
    </div>
  );
}
