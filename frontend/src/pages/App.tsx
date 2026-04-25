import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { useState } from "react";
import { NewStudyPlace } from "./NewStudyPlace";
import { StudyPlacesPage } from "./StudyPlacesPage";
import { FiltersPanel } from "../components/FiltersPanel";
import StudyPlaceDetails from "./StudyPlaceDetails";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import StudyPlacesMap from "../components/StudyPlacesMap";
import SavedPlaces from "../components/SavedPlaces";
import { calculateDistance } from "../utils/calculateDistance";
import { geocodeAddress } from "../services/nominatimService";
import { workingHoursCategoryMatches } from "../utils/workingHours";

type FiltersState = {
  wifi_speed: string;
  noise_level: string;
  place_type: string;
  power_availability: string;
  working_hours: string;
};

export function App() {
  // Coordinates from Nominatim or null if not searched
  const [searchQuery, setSearchQuery] = useState<{ lat: number; lon: number } | null>(null);
  // Results array from backend
  const [results, setResults] = useState<any[]>([]);
  // Loading state
  const [loading, setLoading] = useState(false);
  // Track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    wifi_speed: "",
    noise_level: "",
    place_type: "",
    power_availability: "",
    working_hours: "",
  });

  const buildFilterParams = (userLat: number, userLon: number, filters: FiltersState) => {
    const params = new URLSearchParams({
      lat: userLat.toString(),
      lon: userLon.toString(),
    });

    if (filters.wifi_speed) params.append("wifiSpeed", filters.wifi_speed);
    if (filters.noise_level) params.append("noiseLevel", filters.noise_level);
    if (filters.place_type) params.append("placeType", filters.place_type);
    if (filters.power_availability) params.append("powerAvailability", filters.power_availability);
    if (filters.working_hours) params.append("workingHours", filters.working_hours);

    return params.toString();
  };

  const fetchPlaces = async (
    userLat: number,
    userLon: number,
    filtersToUse: FiltersState
  ) => {
    const params = buildFilterParams(userLat, userLon, filtersToUse);
    const backendRes = await fetch(`/api/study-places/filtered?${params}`);

    if (backendRes.ok === false) {  // vietoj !backendRes.ok
      throw new Error("Failed to fetch study places");
    } 

    const places = await backendRes.json();

    return places
      .map((place: any) => {
        const distance = calculateDistance(userLat, userLon, place.lat, place.lon);
        return {
          ...place,
          distance,
          distanceFormatted: `${distance.toFixed(1)} km`,
        };
      })
      .filter((place: any) => place.distance <= 2)
      .filter((place: any) => !filtersToUse.wifi_speed || place.wifi_speed === filtersToUse.wifi_speed)
      .filter((place: any) => !filtersToUse.noise_level || place.noise_level === filtersToUse.noise_level)
      .filter((place: any) => !filtersToUse.place_type || place.place_type === filtersToUse.place_type)
      .filter((place: any) => !filtersToUse.power_availability || place.power_availability === filtersToUse.power_availability)
      .filter((place: any) => !filtersToUse.working_hours || workingHoursCategoryMatches(place.working_hours ?? "", filtersToUse.working_hours))
      .sort((a: any, b: any) => a.distance - b.distance);
  };

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

      const places = await fetchPlaces(userLat, userLon, filters);
      setResults(places);
    } catch (err) {
      console.error(err);
      setResults([]);
      setSearchQuery(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: FiltersState) => {
    setFilters(newFilters);

    if (!searchQuery) return;

    setLoading(true);
    try {
      const places = await fetchPlaces(searchQuery.lat, searchQuery.lon, newFilters);
      setResults(places);
    } catch (err) {
      console.error(err);
      setResults([]);
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
              <nav className="mb-4 flex flex-wrap gap-2 text-sm">
                <Link className="rounded border px-3 py-1 hover:bg-gray-50" to="/">Pradžia</Link>
                <Link className="rounded border px-3 py-1 hover:bg-gray-50" to="/study-places">Visos vietos</Link>
                <Link className="rounded border px-3 py-1 hover:bg-gray-50" to="/saved-places">Išsaugotos vietos</Link>
                <Link className="rounded border px-3 py-1 hover:bg-gray-50" to="/new-study-place">Nauja vieta</Link>
              </nav>
              <h1 className="text-2xl font-bold mb-4">Study Map</h1>
              <div className="mt-6">
                <StudyPlacesMap />
              </div>
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <FiltersPanel filters={filters} onChange={handleFilterChange} />
              </div>
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

        <Route path="/study-place/:id" element={<StudyPlaceDetails />} />

        <Route path="/saved-places" element={<SavedPlaces />} />

        <Route
          path="/study-places"
          element={
            <div className="study-places-page">
              <div className="app">
                <h1>Study Places</h1>
                <StudyPlacesPage />
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
