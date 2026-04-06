import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

type StudyPlace = {
  id: number;
  name: string;
  status: string;
  position: LatLngExpression;
};

interface StudyPlacesMapProps {
  onPlaceInfo?: (placeId: number) => void;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function StudyPlacesMap({ onPlaceInfo }: StudyPlacesMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<StudyPlace | null>(null);
  const [showSettings, setShowSettings] = useState(false);
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

  const openSettings = (place: StudyPlace) => {
    setSelectedPlace(place);
    setCurrentStatus(place.status);
    setShowSettings(true);
  };

  return (
    <div>
      <MapContainer
        center={[54.6872, 25.2797] as LatLngExpression}
        zoom={13}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.position}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold mb-2">{place.name}</h3>
                <p className="mb-3">Statusas: {place.status}</p>
                <button
                  type="button"
                  onClick={() => onPlaceInfo?.(place.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700 text-sm"
                >
                  Informacija
                </button>
                <button
                  type="button"
                  onClick={() => openSettings(place)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                >
                  Statusas
                </button>
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
    </div>
  );
}