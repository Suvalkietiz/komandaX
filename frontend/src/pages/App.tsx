import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { NewStudyPlace } from "./NewStudyPlace";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import StudyPlacesMap from "../components/StudyPlacesMap";
import { calculateDistance } from "../utils/calculateDistance";

export function App() {
  const [searchQuery, setSearchQuery] = useState<{ lat: number; lon: number } | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (address: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
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

      const backendRes = await fetch(`/api/study-places?lat=${userLat}&lon=${userLon}`);
      let places = await backendRes.json();

      places = places
        .map((place: any) => {
          const distance = calculateDistance(userLat, userLon, place.lat, place.lon);
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
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-4xl mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Study Map</h1>
              <SearchBar onSearch={handleSearch} />

              <div className="mt-6">
                {loading && <div className="text-center text-blue-600">Ieškoma...</div>}
                {!loading && hasSearched ? (
                  <ResultsList results={results} />
                ) : (
                  <div className="text-center text-gray-400 mt-8">
                    Įveskite adresą, kad pradėtumėte paiešką
                  </div>
                )}
              </div>

              <div className="mt-8">
                <StudyPlacesMap />
              </div>
            </div>
          }
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
    </BrowserRouter>
  );
}