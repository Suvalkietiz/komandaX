import { db } from "../db/db";
import type { StudyPlace } from "../models/studyPlace";

export interface CreateStudyPlaceInput {
  // this lacks some fields
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
     (osm_id, name, latitude, longitude, status, avg_rating, wifi_speed, noise_level, power_availability, place_type, working_hours)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      1,
      "someRandomName",
      1.1,
      2.2,
      "someStatus",
      5.0,
      data.wifiSpeed,
      data.noiseLevel,
      data.powerAvailability,
      data.placeType,
      data.workingHours
    ]
  );

  return result.rows[0];
}

