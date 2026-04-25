import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import ReviewForm from "./ReviewForm";
import { savePlace } from "../services/savedPlacesService";
import { getStudyPlaces } from "../services/studyPlacesService";
import { mapPlacesData } from "../data/mapPlacesData";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

const STATUS_STORAGE_KEY = "komandax.mapPlaceStatuses";
const STATUS_OPTIONS = ["Atidaryta", "Vidutinis užimtumas", "Pilna", "Uždaryta"];

type StudyPlace = {
  id: number;
  name: string;
  address: string;
  status: string;
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  has_outlets: boolean;
  position: LatLngExpression;
};

const fallbackPlaces: StudyPlace[] = mapPlacesData.map((place) => ({
  id: place.id,
  name: place.name,
  address: place.address,
  status: place.status,
  wifi_speed: place.wifi_speed,
  noise_level: place.noise_level,
  power_availability: place.power_availability,
  has_outlets: place.has_outlets,
  position: [place.lat, place.lon] as LatLngExpression,
}));

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function StudyPlacesMap() {
  const [places, setPlaces] = useState<StudyPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<StudyPlace | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [savingPlaceId, setSavingPlaceId] = useState<number | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState("");

  const readStoredStatuses = () => {
    try {
      const raw = window.localStorage.getItem(STATUS_STORAGE_KEY);
      if (!raw) {
        return {} as Record<string, string>;
      }

      const parsed = JSON.parse(raw) as Record<string, string>;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {} as Record<string, string>;
    }
  };

  const writeStoredStatuses = (nextStatuses: Record<string, string>) => {
    window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(nextStatuses));
  };

  const applyStoredStatuses = (inputPlaces: StudyPlace[]) => {
    const storedStatuses = readStoredStatuses();

    return inputPlaces.map((place) => ({
      ...place,
      status: storedStatuses[String(place.id)] ?? place.status,
    }));
  };

  useEffect(() => {
    let cancelled = false;

    const loadPlaces = async () => {
      setMapLoading(true);
      setMapError(null);

      try {
        const apiPlaces = await getStudyPlaces();
        if (cancelled) return;

        const mappedPlaces = apiPlaces
          .filter((place) => place.lat !== null && place.lon !== null)
          .map((place) => {
            const parsedId = Number(place.id);
            const storedStatuses = readStoredStatuses();
            const storedStatus = storedStatuses[String(parsedId)];
            return {
              id: parsedId,
              name: place.name,
              address: place.address,
              status: storedStatus ?? (place.verified ? "Atidaryta" : "Uždaryta"),
              wifi_speed: place.wifi_speed || "Nežinoma",
              noise_level: place.noise_level || "Nežinomas",
              power_availability: place.has_outlets ? "sufficient" : "limited",
              has_outlets: Boolean(place.has_outlets),
              position: [place.lat as number, place.lon as number] as LatLngExpression,
            };
          })
          .filter((place) => Number.isFinite(place.id));

        setPlaces(mappedPlaces.length > 0 ? mappedPlaces : applyStoredStatuses(fallbackPlaces));
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Nepavyko užkrauti žemėlapio vietų.";
          setMapError(`${message} Rodomos rezervinės vietos.`);
          setPlaces(applyStoredStatuses(fallbackPlaces));
        }
      } finally {
        if (!cancelled) {
          setMapLoading(false);
        }
      }
    };

    loadPlaces();

    return () => {
      cancelled = true;
    };
  }, []);

  const navigate = useNavigate();

  const openSettings = (place: StudyPlace) => {
    setSelectedPlace(place);
    setCurrentStatus(place.status);
    setShowSettings(true);
  };

  const saveStatus = () => {
    if (!selectedPlace || !currentStatus) {
      return;
    }

    setPlaces((currentPlaces) =>
      currentPlaces.map((place) =>
        place.id === selectedPlace.id ? { ...place, status: currentStatus } : place
      )
    );

    setSelectedPlace((current) =>
      current ? { ...current, status: currentStatus } : current
    );

    setMapError(null);

    const nextStatuses = {
      ...readStoredStatuses(),
      [String(selectedPlace.id)]: currentStatus,
    };
    writeStoredStatuses(nextStatuses);
    setShowSettings(false);
  };

  const openDetails = (place: StudyPlace) => {
    navigate(`/study-place/${place.id}`);
  };

  const openReview = (place: StudyPlace) => {
    setSelectedPlace(place);
    setShowReview(true);
  };

  const handleSavePlace = async (place: StudyPlace) => {
    try {
      setSavingPlaceId(place.id);
      await savePlace(place.id, {
        id: place.id,
        name: place.name,
        address: place.address,
        wifi_speed: place.wifi_speed,
        noise_level: place.noise_level,
        power_availability: place.power_availability,
        has_outlets: place.has_outlets,
      });
      navigate("/saved-places");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nepavyko išsaugoti vietos.";
      if (message.toLowerCase().includes("already saved")) {
        navigate("/saved-places");
        return;
      }
      window.alert(message);
    } finally {
      setSavingPlaceId(null);
    }
  };

  return (
    <div>
      <MapContainer
        center={[54.6872, 25.2797]}
        zoom={13}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.position}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <h3>{place.name}</h3>
                <p>Statusas: {place.status}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button type="button" onClick={() => openSettings(place)}>
                    Statuso nustatymai
                  </button>
                  <button type="button" onClick={() => openDetails(place)}>
                    Informacija
                  </button>
                  <button type="button" onClick={() => openReview(place)}>
                    Įvertinti vietą
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePlace(place)}
                    disabled={savingPlaceId === place.id}
                  >
                    {savingPlaceId === place.id ? "Saugoma..." : "Išsaugoti vietą"}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {mapLoading && <div style={{ marginTop: "12px" }}>Kraunamos vietos...</div>}
      {mapError && <div style={{ marginTop: "12px", color: "#dc2626" }}>{mapError}</div>}
      {!mapLoading && !mapError && places.length === 0 && (
        <div style={{ marginTop: "12px" }}>Nerasta vietų žemėlapiui.</div>
      )}

      {showSettings && selectedPlace && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "12px",
          }}
        >
          <h2>Statuso nustatymai</h2>

          <p>
            <strong>Erdvė:</strong> {selectedPlace.name}
          </p>

          <label htmlFor="status-select">
            <strong>Statusas:</strong>
          </label>
          <br />
          <select
            id="status-select"
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            style={{ marginTop: "8px", padding: "8px" }}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button type="button" onClick={saveStatus}>
              Išsaugoti statusą
            </button>
            <button type="button" onClick={() => setShowSettings(false)}>
              Uždaryti
            </button>
          </div>
        </div>
      )}

      {showReview && selectedPlace && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, minWidth: 350, maxWidth: 500 }}>
            <button type="button" style={{ float: "right" }} onClick={() => setShowReview(false)}>X</button>
            <ReviewForm studyPlaceId={selectedPlace.id} />
          </div>
        </div>
      )}

    </div>
  );
}