import type { Request, Response } from "express";
import { db as pool } from "../db/db";

// Laikinas testinis registruotas vartotojas
const getCurrentUserId = () => 1;

// Išsaugoti vietą
export const savePlace = async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId();
    const { studyPlaceId } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: "Only registered users can save places." });
    }

    if (!studyPlaceId) {
      return res.status(400).json({ error: "studyPlaceId is required." });
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

    const result = await pool.query(
      `SELECT * FROM saved_places WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      message: "Saved places fetched successfully.",
      data: result.rows,
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