import { db } from "../db/db";
import type { StudyPlace } from "../models/studyPlace";

export interface CreateStudyPlaceInput {
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
     (wifi_speed, noise_level, power_availability, place_type, working_hours)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at`,
    [
      data.wifiSpeed,
      data.noiseLevel,
      data.powerAvailability,
      data.placeType,
      data.workingHours
    ]
  );

  return result.rows[0];
}

export async function getAllStudyPlaces(): Promise<StudyPlace[]> {
  const result = await db.query<StudyPlace>(
    `SELECT id, wifi_speed, noise_level, power_availability, place_type, working_hours, created_at
     FROM study_places
     ORDER BY created_at DESC`
  );
  return result.rows;
}

