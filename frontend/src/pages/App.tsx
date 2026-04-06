import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
import { NewStudyPlace } from "./NewStudyPlace";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import { calculateDistance } from "../utils/calculateDistance";
import { geocodeAddress } from "../services/nominatimService";

export function App() {
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
      const coordinates = await geocodeAddress(address);
      if (!coordinates) {
        setSearchQuery(null);
        setResults([]);
        setLoading(false);
        return;
      }
      const { lat: userLat, lon: userLon } = coordinates;
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
                  <div className="text-center text-gray-400 mt-8">Įveskite adresą, kad pradėtumėte paiešką</div>
                )}
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

