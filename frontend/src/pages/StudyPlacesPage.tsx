import { useEffect, useState } from "react"; 
import { FiltersPanel } from "../components/FiltersPanel";  
import { StudyPlacesList } from "../components/StudyPlacesList";

type StudyPlace = {
    id: number;
    wifi_speed: string;
    noise_level: string;
    place_type: string;
    power_availability: string;
    working_hours: string;
    created_at: string;
};

export function StudyPlacesPage() {
    const [places, setPlaces] = useState<StudyPlace[]>([]);
    const [filters, setFilters] = useState({
        wifi_speed: "",
        noise_level: "",
        place_type: "",
        power_availability: "",
        working_hours: "",
    });
    const [sort, setSort] = useState("newest");

     useEffect(() => {
    const mockPlaces: StudyPlace[] = [
      {
        id: 1,
        wifi_speed: "fast",
        noise_level: "low",
        place_type: "library",
        power_availability: "sufficient",
        working_hours: "09:00-18:00",
        created_at: "2026-03-16T08:00:00Z"
      },
      {
        id: 2,
        wifi_speed: "slow",
        noise_level: "medium",
        place_type: "cafe",
        power_availability: "insufficient",
        working_hours: "08:00-22:00",
        created_at: "2026-03-15T12:00:00Z"
      },
      {
        id: 3,
        wifi_speed: "medium",
        noise_level: "high",
        place_type: "bar",
        power_availability: "insufficient",
        working_hours: "08:00-20:00",
        created_at: "2026-03-16T20:00:00Z"
      }
    ];
    setPlaces(mockPlaces);
  }, []);

  let filtered = places.filter((p) => {
    return (
      (filters.wifi_speed === "" || p.wifi_speed === filters.wifi_speed) &&
      (filters.noise_level === "" || p.noise_level === filters.noise_level) &&
      (filters.place_type === "" || p.place_type === filters.place_type) &&
      (filters.power_availability === "" || p.power_availability === filters.power_availability) &&
      (filters.working_hours === "" || p.working_hours === filters.working_hours)
    );
  });


    return (
    <div>
      <FiltersPanel filters={filters} onChange={setFilters} />
      <StudyPlacesList places={filtered} />
    </div>
  );

}