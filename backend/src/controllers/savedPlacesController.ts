import type { Request, Response } from "express";
import { db as pool } from "../db/db";

// Laikinas testinis registruotas vartotojas
const getCurrentUserId = () => 1;

type SavedPlaceSnapshot = {
  id: number;
  name: string;
  address: string;
  wifi_speed?: string;
  noise_level?: string;
  power_availability?: string;
  has_outlets?: boolean;
};

const snapshotStore = new Map<number, SavedPlaceSnapshot>();

// Išsaugoti vietą
export const savePlace = async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId();
    const { studyPlaceId, place } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: "Only registered users can save places." });
    }

    if (!studyPlaceId) {
      return res.status(400).json({ error: "studyPlaceId is required." });
    }

    if (
      place &&
      typeof place === "object" &&
      typeof place.name === "string" &&
      place.name.trim() &&
      typeof place.address === "string"
    ) {
      snapshotStore.set(Number(studyPlaceId), {
        id: Number(studyPlaceId),
        name: place.name,
        address: place.address,
        wifi_speed: typeof place.wifi_speed === "string" ? place.wifi_speed : undefined,
        noise_level: typeof place.noise_level === "string" ? place.noise_level : undefined,
        power_availability:
          typeof place.power_availability === "string" ? place.power_availability : undefined,
        has_outlets: typeof place.has_outlets === "boolean" ? place.has_outlets : undefined,
      });
    }

    const existing = await pool.query(
      `SELECT * FROM saved_places WHERE user_id = $1 AND study_place_id = $2`,
      [userId, Number(studyPlaceId)]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Place is already saved." });
    }

    const result = await pool.query(
      `INSERT INTO saved_places (user_id, study_place_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, Number(studyPlaceId)]
    );

    return res.status(201).json({
      message: "Place saved successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("savePlace error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Gauti išsaugotas vietas
export const getSavedPlaces = async (_req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      return res.status(401).json({ error: "Only registered users can view saved places." });
    }

    const result = await pool.query<{
      id: number;
      userId: number;
      studyPlaceId: number;
      placeId: number | null;
      placeName: string | null;
      placeAddress: string | null;
      placeWifiSpeed: string | null;
      placeNoiseLevel: string | null;
      placePowerAvailability: string | null;
    }>(
      `SELECT
         s.id,
         s.user_id AS "userId",
         s.study_place_id AS "studyPlaceId",
         sp.id AS "placeId",
         sp.name AS "placeName",
         sp.address AS "placeAddress",
         sp.wifi_speed AS "placeWifiSpeed",
         sp.noise_level AS "placeNoiseLevel",
         sp.power_availability AS "placePowerAvailability"
       FROM saved_places s
       LEFT JOIN study_places sp ON sp.id = s.study_place_id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId]
    );

    const data = result.rows.map((row) => {
      const fromDb = row.placeId !== null;
      const snapshot = snapshotStore.get(row.studyPlaceId);

      const powerAvailability =
        (fromDb ? row.placePowerAvailability : undefined) ?? snapshot?.power_availability;

      const hasOutlets =
        fromDb && row.placePowerAvailability
          ? row.placePowerAvailability.toLowerCase().includes("yes") ||
            row.placePowerAvailability.toLowerCase().includes("yra") ||
            row.placePowerAvailability.toLowerCase().includes("sufficient")
          : snapshot?.has_outlets;

      const place = {
        id: row.studyPlaceId,
        name:
          (fromDb ? row.placeName : snapshot?.name) ||
          `Išsaugota vieta #${row.studyPlaceId}`,
        address:
          (fromDb ? row.placeAddress : snapshot?.address) ||
          "Adresas nenurodytas",
        wifi_speed: (fromDb ? row.placeWifiSpeed : undefined) ?? snapshot?.wifi_speed,
        noise_level: (fromDb ? row.placeNoiseLevel : undefined) ?? snapshot?.noise_level,
        power_availability: powerAvailability,
        has_outlets: hasOutlets,
      };

      return {
        id: row.id,
        userId: row.userId,
        studyPlaceId: row.studyPlaceId,
        place,
      };
    });

    return res.status(200).json({
      message: "Saved places fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("getSavedPlaces error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Pašalinti vietą
export const removeSavedPlace = async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId();
    const studyPlaceId = Number(req.params.studyPlaceId);

    if (!userId) {
      return res.status(401).json({ error: "Only registered users can remove saved places." });
    }

    if (!studyPlaceId) {
      return res.status(400).json({ error: "studyPlaceId is required." });
    }

    const result = await pool.query(
      `DELETE FROM saved_places
       WHERE user_id = $1 AND study_place_id = $2
       RETURNING *`,
      [userId, studyPlaceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Saved place not found." });
    }

    return res.status(200).json({
      message: "Saved place removed successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("removeSavedPlace error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};