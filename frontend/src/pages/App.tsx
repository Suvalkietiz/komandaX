import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { SearchControls } from "../components/SearchControls";

type FiltersState = {
  wifi_speed: string;
  noise_level: string;
  place_type: string;
  power_availability: string;
  working_hours: string;
  sort?: "distance" | "newest";
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

  const [mode, setMode] = useState<"nearby" | "all">("nearby");

  const [filters, setFilters] = useState<FiltersState>({
    wifi_speed: "",
    noise_level: "",
    place_type: "",
    power_availability: "",
    working_hours: "",
    sort: "distance",
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
   filtersToUse: FiltersState,
   mode: "nearby" | "all"
  ) => {
  const params = buildFilterParams(userLat, userLon, filtersToUse);

  const backendRes = await fetch(`/api/study-places/filtered?${params}`);

  if (!backendRes.ok) {
    throw new Error("Failed to fetch study places");
  }

  const places = await backendRes.json();

  // 1. pridedam distance visiems
  const enriched = places.map((place: any) => {
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
  });

  // 2. 2km filtras 
  const filtered =
    mode === "nearby"
      ? enriched.filter((place: any) => place.distance <= 2)
      : enriched;

  // 3. sorting 
  return filtered.sort((a: any, b: any) => {
    if (filtersToUse.sort === "distance") {
      return a.distance - b.distance;
    }

    if (filtersToUse.sort === "newest") {
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    }

     return 0;
   });
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

      const places = await fetchPlaces(userLat, userLon, filters, mode);
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
      const places = await fetchPlaces(searchQuery.lat, searchQuery.lon, newFilters, mode);
      setResults(places);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (newMode: "nearby" | "all") => {
    setMode(newMode);

    if (!searchQuery) return;

    setLoading(true);

    try {
      const places = await fetchPlaces(
      searchQuery.lat,
      searchQuery.lon,
      filters,
      newMode
    );

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

              <StudyPlacesMap />

              <SearchControls
                mode={mode}
                setMode={handleModeChange}
                sort={filters.sort ?? "distance"}
                onSortChange={(sort) =>
                  handleFilterChange({ ...filters, sort })
                }
                onSearch={handleSearch}
                showControls={hasSearched}
              />
                <FiltersPanel filters={filters} onChange={handleFilterChange} />
              
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
