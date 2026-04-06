import type { Request, Response } from "express";
import { createStudyPlace } from "../services/studyPlacesService";
import { getAllStudyPlaces } from "../services/studyPlacesService";
import { getFilteredStudyPlaces } from "../services/studyPlacesService";

export const create = async (req: Request, res: Response) => {
  const {
    wifiSpeed,
    noiseLevel,
    powerAvailability,
    placeType,
    workingHours
  } = req.body || {};

  if (
    !wifiSpeed ||
    !noiseLevel ||
    !powerAvailability ||
    !placeType ||
    !workingHours
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const place = await createStudyPlace({
      wifiSpeed,
      noiseLevel,
      powerAvailability,
      placeType,
      workingHours
    });
    return res.status(201).json(place);
  } catch (error) {
    console.error("Error inserting study place", error);
    return res.status(500).json({ error: "Failed to save study place." });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const places = await getAllStudyPlaces();
    return res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching study places", error);
    return res.status(500).json({ error: "Failed to fetch study places." });
  }
};

export const getFiltered = async (req: Request, res: Response) => {
  try {
    const places = await getFilteredStudyPlaces(req.query);
    return res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching filtered study places", error);
    return res.status(500).json({ error: "Failed to fetch filtered study places." });
  }
  
};