export type MapPlaceDataItem = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  status: string;
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  has_outlets: boolean;
};

// Source aligned with backend test data from backend/src/scripts/insertTestStudyPlace.ts
export const mapPlacesData: MapPlaceDataItem[] = [
  {
    id: 100001,
    name: "Testine biblioteka",
    address: "Testo g. 1, Vilnius",
    lat: 54.6872,
    lon: 25.2797,
    status: "Atidaryta",
    wifi_speed: "Greitas",
    noise_level: "Tylu",
    power_availability: "Yra",
    has_outlets: true,
  },
  {
    id: 100002,
    name: "VILNIUS TECH biblioteka",
    address: "Sauletekio al. 11, Vilnius",
    lat: 54.7223,
    lon: 25.3376,
    status: "Atidaryta",
    wifi_speed: "Fast",
    noise_level: "Low",
    power_availability: "Sufficient",
    has_outlets: true,
  },
  {
    id: 100003,
    name: "Study Cafe",
    address: "Gedimino pr. 13, Vilnius",
    lat: 54.6872,
    lon: 25.2797,
    status: "Atidaryta",
    wifi_speed: "Fast",
    noise_level: "Medium",
    power_availability: "Sufficient",
    has_outlets: true,
  },
  {
    id: 100004,
    name: "Miesto skaitykla",
    address: "Gedimino pr. 43, Vilnius",
    lat: 54.6895,
    lon: 25.2682,
    status: "Atidaryta",
    wifi_speed: "Slow",
    noise_level: "High",
    power_availability: "Insufficient",
    has_outlets: false,
  },
];
