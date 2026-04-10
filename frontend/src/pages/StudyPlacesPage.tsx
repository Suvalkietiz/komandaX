import { useEffect, useState } from "react";
import { FiltersPanel } from "../components/FiltersPanel";
import { StudyPlacesList } from "../components/StudyPlacesList";

type StudyPlace = {
  id: number;
  avg_rating: number;
  wifi_speed: string;
  noise_level: string;
  place_type: string;
  power_availability: string;
  working_hours: string;
  created_at: string;
};

export function StudyPlacesPage() {
  const [places, setPlaces] = useState<StudyPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    wifi_speed: "",
    noise_level: "",
    place_type: "",
    power_availability: "",
    working_hours: "",
  });

  const [sort, setSort] = useState("newest");

  // fetch iš backend
  const fetchPlaces = async (newFilters: typeof filters) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

       if (newFilters.wifi_speed) {
      params.append("wifiSpeed", newFilters.wifi_speed);
      }
       if (newFilters.noise_level) {
      params.append("noiseLevel", newFilters.noise_level);
      }
       if (newFilters.place_type) {
      params.append("placeType", newFilters.place_type);
      }
       if (newFilters.power_availability) {
      params.append("powerAvailability", newFilters.power_availability);
      }
       if (newFilters.working_hours) {
      params.append("workingHours", newFilters.working_hours);
      }

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await fetch(
        `/api/study-places/filtered?${params.toString()}`
      );

      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Failed to fetch places", err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // pirmas load
  useEffect(() => {
    fetchPlaces(filters);
  }, []);

  // filtras keičiasi → backend call
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchPlaces(newFilters);
  };

  let sorted = [...places];

  if (sort === "newest") {
    sorted.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }

  if (sort === "rating") {
  
  }

  return (
    <div>
      <label>
        Sort by:
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="rating">Rating</option>
        </select>
      </label>

      {/* filters */}
      <FiltersPanel filters={filters} onChange={handleFilterChange} />

      {loading && (
        <div style={{ marginTop: 10 }}>Loading...</div>
      )}

      <StudyPlacesList places={sorted} />
    </div>
  );
}