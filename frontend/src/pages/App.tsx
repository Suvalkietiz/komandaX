import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import { useState } from "react";
import { NewStudyPlace } from "./NewStudyPlace";
import { FiltersPanel } from "../components/FiltersPanel";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import StudyPlacesMap from "../components/StudyPlacesMap";
import SavedPlaces from "../components/SavedPlaces";
import { calculateDistance } from "../utils/calculateDistance";
import { geocodeAddress } from "../services/nominatimService";

type FiltersState = {
  wifi_speed: string;
  noise_level: string;
  place_type: string;
  power_availability: string;
  working_hours: string;
};

type StudyPlaceItem = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  place_type: string;
  working_hours: string;
};

const localStudyPlaces: StudyPlaceItem[] = [
  {
    id: 1,
    name: "VILNIUS TECH biblioteka",
    address: "Saulėtekio al. 11, Vilnius",
    lat: 54.7223,
    lon: 25.3376,
    wifi_speed: "fast",
    noise_level: "low",
    power_availability: "sufficient",
    place_type: "library",
    working_hours: "00:00-24:00",
  },
  {
    id: 2,
    name: "Study Cafe",
    address: "Gedimino pr. 13, Vilnius",
    lat: 54.6872,
    lon: 25.2797,
    wifi_speed: "fast",
    noise_level: "medium",
    power_availability: "sufficient",
    place_type: "cafe",
    working_hours: "08:00-22:00",
  },
  {
    id: 3,
    name: "Miesto skaitykla",
    address: "Gedimino pr. 43, Vilnius",
    lat: 54.6895,
    lon: 25.2682,
    wifi_speed: "slow",
    noise_level: "high",
    power_availability: "insufficient",
    place_type: "other",
    working_hours: "09:00-18:00",
  },
];

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

  const fetchPlaces = async (userLat: number, userLon: number, filtersToUse: FiltersState) => {
    let places: StudyPlaceItem[] = [];

    try {
      const params = buildFilterParams(userLat, userLon, filtersToUse);
      const backendRes = await fetch(`/api/study-places/filtered?${params}`);
      if (!backendRes.ok) {
        throw new Error("Failed to fetch study places");
      }
      const serverPlaces = await backendRes.json();
      places = Array.isArray(serverPlaces) ? serverPlaces : [];
    } catch {
      places = localStudyPlaces.filter((place) => {
        if (filtersToUse.wifi_speed && place.wifi_speed !== filtersToUse.wifi_speed) return false;
        if (filtersToUse.noise_level && place.noise_level !== filtersToUse.noise_level) return false;
        if (filtersToUse.place_type && place.place_type !== filtersToUse.place_type) return false;
        if (filtersToUse.power_availability && place.power_availability !== filtersToUse.power_availability) return false;
        if (filtersToUse.working_hours && place.working_hours !== filtersToUse.working_hours) return false;
        return true;
      });
    }

    return places
      .map((place: any) => {
        const distance = calculateDistance(userLat, userLon, place.lat, place.lon);
        return {
          ...place,
          has_outlets: place.power_availability === "sufficient",
          distance,
          distanceFormatted: `${distance.toFixed(1)} km`,
        };
      })
      .filter((place: any) => place.distance <= 2)
      .sort((a: any, b: any) => a.distance - b.distance);
  };

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

      const places = await fetchPlaces(userLat, userLon, filters);
      setResults(places);
    } catch (err) {
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
    } catch {
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
              <h1 className="text-2xl font-bold mb-4">Study Map</h1>
              <div className="mb-4">
                <Link
                  to="/saved-places"
                  className="inline-block px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Mano išsaugotos vietos
                </Link>
              </div>
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

        <Route path="/saved-places" element={<SavedPlaces />} />
      </Routes>
    </BrowserRouter>
  );
}

