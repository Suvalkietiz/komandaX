import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import ReviewForm from "./ReviewForm";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

type StudyPlace = {
  id: number;
  name: string;
  status: string;
  position: LatLngExpression;
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function StudyPlacesMap() {
  const [selectedPlace, setSelectedPlace] = useState<StudyPlace | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  const places: StudyPlace[] = [
    {
      id: 1,
      name: "VILNIUS TECH biblioteka",
      status: "Atidaryta",
      position: [54.7223, 25.3376],
    },
    {
      id: 2,
      name: "Study Cafe",
      status: "Vidutinis užimtumas",
      position: [54.6872, 25.2797],
    },
    {
      id: 3,
      name: "Miesto skaitykla",
      status: "Uždaryta",
      position: [54.6895, 25.2682],
    },
  ];

  const navigate = useNavigate();

  const openSettings = (place: StudyPlace) => {
    setSelectedPlace(place);
    setCurrentStatus(place.status);
    setShowSettings(true);
  };

  const openDetails = (place: StudyPlace) => {
    navigate(`/study-place/${place.id}`);
  };

  const openReview = (place: StudyPlace) => {
    setSelectedPlace(place);
    setShowReview(true);
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
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

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
            <option value="Atidaryta">Atidaryta</option>
            <option value="Vidutinis užimtumas">Vidutinis užimtumas</option>
            <option value="Pilna">Pilna</option>
            <option value="Uždaryta">Uždaryta</option>
          </select>

          <div style={{ marginTop: "16px" }}>
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