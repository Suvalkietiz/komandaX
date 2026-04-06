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

