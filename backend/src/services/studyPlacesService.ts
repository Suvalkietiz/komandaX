import { db } from "../db/db";
import type { StudyPlace } from "../models/studyPlace";

export interface CreateStudyPlaceInput {
  name: string;
  address: string;
  osmId: string;
  lat: number;
  lon: number;
  verified: boolean;
  wifiSpeed: string;
  noiseLevel: string;
  powerAvailability: string;
  placeType: string;
  workingHours: string;
}

export async function createStudyPlace(
  data: CreateStudyPlaceInput
): Promise<StudyPlace> {
  const result = await db.query<StudyPlace>(
    `INSERT INTO study_places
     (name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at`,
    [
      data.name,
      data.address,
      data.osmId,
      data.lat,
      data.lon,
      data.verified,
      data.wifiSpeed,
      data.noiseLevel,
      data.powerAvailability,
      data.placeType,
      data.workingHours
    ]
  );

  return result.rows[0];
}

type StudyPlaceRow = {
  id: number;
  name?: string | null;
  address?: string | null;
  lat?: number | null;
  lon?: number | null;
  verified?: boolean | null;
  wifi_speed?: string | null;
  noise_level?: string | null;
  power_availability?: string | null;
  place_type?: string | null;
  working_hours?: string | null;
};

export type StudyPlaceListItem = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lon: number | null;
  verified: boolean;
  wifi_speed: string;
  noise_level: string;
  has_outlets: boolean;
};

function toBooleanOutlets(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.toLowerCase();
  return normalized.includes("yes") || normalized.includes("yra") || normalized.includes("true");
}

export async function getStudyPlaceById(id: number): Promise<StudyPlace | null> {
  const result = await db.query<StudyPlace>(
    `SELECT id, name, address, osm_id, lat, lon, verified, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at
     FROM study_places
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function getStudyPlaces(): Promise<StudyPlaceListItem[]> {
  const result = await db.query<StudyPlaceRow>(
    `SELECT
       id,
       name,
       address,
       lat,
       lon,
       verified,
       wifi_speed,
       noise_level,
       power_availability,
       place_type
     FROM study_places
     WHERE verified = TRUE
       AND lat IS NOT NULL
       AND lon IS NOT NULL
     ORDER BY created_at DESC`
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    name: row.name ?? row.place_type ?? `Study place #${row.id}`,
    address: row.address ?? "Adresas nenurodytas",
    lat: row.lat ?? null,
    lon: row.lon ?? null,
    verified: row.verified ?? false,
    wifi_speed: row.wifi_speed ?? "Nežinoma",
    noise_level: row.noise_level ?? "Nežinomas",
    has_outlets: toBooleanOutlets(row.power_availability),
  }));
}

type FilterParams = {
  wifiSpeed?: string;
  noiseLevel?: string;
  powerAvailability?: string;
  placeType?: string;
  workingHours?: string;
  sort?: string;
};

const parseWorkingHoursRange = (workingHours: string) => {
  if (!workingHours) return null;

  const [startStr, endStr] = workingHours.split("-");

  const startHour = Number(startStr.split(":")[0]);
  const endHour = Number(endStr.split(":")[0]);

  if (Number.isNaN(startHour) || Number.isNaN(endHour)) {
    return null;
  }

  return {
    start: startHour,
    end: endHour,
  };
};

const workingHoursCategoryMatches = (workingHours: string, category: string) => {
  const range = parseWorkingHoursRange(workingHours);
  if (!range) {
    return false;
  }

  if (category === "morning") {
    return range.start < 12 && range.end > 6;
  }

  if (category === "afternoon") {
    return range.start < 18 && range.end > 12;
  }

  if (category === "evening") {
    return range.start < 24 && range.end > 18;
  }

  return false;
};

const isWorkingHoursCategory = (value: string) =>
  value === "morning" || value === "afternoon" || value === "evening";

export const getStudyPlacesFiltered = async (filters: FilterParams) => {
  let query = "SELECT * FROM study_places WHERE 1=1";
  const values: unknown[] = [];
  let index = 1;

  if (filters.wifiSpeed) {
    query += ` AND LOWER(wifi_speed) = LOWER($${index++})`;
    values.push(filters.wifiSpeed);
  }

  if (filters.noiseLevel) {
    query += ` AND LOWER(noise_level) = LOWER($${index++})`;
    values.push(filters.noiseLevel);
  }

  if (filters.powerAvailability) {
    query += ` AND LOWER(power_availability) = LOWER($${index++})`;
    values.push(filters.powerAvailability);
  }

  if (filters.placeType) {
    query += ` AND LOWER(place_type) = LOWER($${index++})`;
    values.push(filters.placeType);
  }

  if (filters.workingHours && !isWorkingHoursCategory(filters.workingHours)) {
    query += ` AND LOWER(working_hours) = LOWER($${index++})`;
    values.push(filters.workingHours);
  }

   // SORT LOGIKA
  if (filters.sort === "distance") {
    query += " ORDER BY lat ASC"; // mock
  } else if (filters.sort === "newest") {
    query += " ORDER BY created_at DESC";
  } else if (filters.sort === "rating") {
    query += " ORDER BY id DESC"; // mock
  } else if (filters.sort === "popularity") {
    query += " ORDER BY id DESC"; // mock
  }

  const result = await db.query(query, values);
  const rows = result.rows;

  if (filters.workingHours && isWorkingHoursCategory(filters.workingHours)) {
    return rows.filter((row) =>
      workingHoursCategoryMatches(row.working_hours ?? "", filters.workingHours!)
    );
  }
  
};

