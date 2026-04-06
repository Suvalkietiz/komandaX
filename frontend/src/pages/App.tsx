import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { useState } from "react";
import { NewStudyPlace } from "./NewStudyPlace";
import { StudyPlaceDetail } from "./StudyPlaceDetail";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import StudyPlacesMap from "../components/StudyPlacesMap";
import { calculateDistance } from "../utils/calculateDistance";

function AppContent() {
  const navigate = useNavigate();
  // Coordinates from Nominatim or null if not searched
  const [searchQuery, setSearchQuery] = useState<{ lat: number; lon: number } | null>(null);
  // Results array from backend
  const [results, setResults] = useState<any[]>([]);
  // Loading state
  const [loading, setLoading] = useState(false);
  // Track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch coordinates from Nominatim, fetch results, filter/sort by 2km radius
  const handleSearch = async (address: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      // 1. Geocode address using Nominatim
      const nominatimRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const geoData = await nominatimRes.json();
      if (!geoData.length) {
        setSearchQuery(null);
        setResults([]);
        setLoading(false);
        return;
      }
      const { lat, lon } = geoData[0];
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);
      setSearchQuery({ lat: userLat, lon: userLon });

      // 2. Fetch study places from backend (replace URL as needed)
      const backendRes = await fetch(`/api/study-places?lat=${userLat}&lon=${userLon}`);
      let places = await backendRes.json();

      // 3. Filter and sort by 2km radius using Haversine
      places = places
        .map((place: any) => {
          const distance = calculateDistance(
            userLat,
            userLon,
            place.lat,
            place.lon
          );
          return {
            ...place,
            distance,
            distanceFormatted: `${distance.toFixed(1)} km`,
          };
        })
        .filter((place: any) => place.distance <= 2)
        .sort((a: any, b: any) => a.distance - b.distance);

      setResults(places);
    } catch (err) {
      setResults([]);
      setSearchQuery(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-4">
            <div className="max-w-4xl mx-auto mb-8">
              <h1 className="text-2xl font-bold mb-4">Study Map</h1>
              <SearchBar onSearch={handleSearch} />
              <div className="mt-6">
                {loading && <div className="text-center text-blue-600">Ieškoma...</div>}
                {!loading && hasSearched ? (
                  <ResultsList results={results} />
                ) : (
                  <div className="text-center text-gray-400 mt-8">Įveskite adresą, kad pradėtumėte paiešką</div>
                )}
              </div>
            </div>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Žemėlapis</h2>
              <StudyPlacesMap onPlaceInfo={(id) => navigate(`/study-place/${id}`)} />
            </div>
          </div>
        }
      />
      <Route
        path="/study-place/:id"
        element={<StudyPlaceDetail />}
      />
      <Route
        path="/new-study-place"
        element={
          <div className="new-study-page">
            <div className="app">
              <h1>New study place Form</h1>
              <NewStudyPlace />
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

