import type { Request, Response } from "express";
import { createStudyPlace, getStudyPlaces, getStudyPlaceById, getStudyPlacesFiltered } from "../services/studyPlacesService";
import { PUBLIC_STUDY_PLACE_ERROR, validatePublicStudyPlace } from "../services/osmValidationService";

export const create = async (req: Request, res: Response) => {
  const {
    name,
    address,
    wifiSpeed,
    noiseLevel,
    powerAvailability,
    placeType,
    workingHours
  } = req.body || {};

  if (
    !name ||
    !address ||
    !wifiSpeed ||
    !noiseLevel ||
    !powerAvailability ||
    !placeType ||
    !workingHours
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { osmId, lat, lon } = await validatePublicStudyPlace(address);

    const place = await createStudyPlace({
      name,
      address,
      osmId,
      lat,
      lon,
      verified: true,
      wifiSpeed,
      noiseLevel,
      powerAvailability,
      placeType,
      workingHours
    });
    return res.status(201).json(place);
  } catch (error) {
    if (error instanceof Error && error.message === PUBLIC_STUDY_PLACE_ERROR) {
      return res.status(400).json({ error: PUBLIC_STUDY_PLACE_ERROR });
    }

    console.error("Error inserting study place", error);
    return res.status(500).json({ error: "Failed to save study place." });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const places = await getStudyPlaces();
    return res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching study places", error);
    return res.status(500).json({ error: "Failed to fetch study places." });
  }
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const placeId = Number(id);

  if (!Number.isInteger(placeId) || placeId <= 0) {
    return res.status(400).json({ error: "Invalid place id." });
  }

  try {
    const place = await getStudyPlaceById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Study place not found." });
    }

    return res.status(200).json(place);
  } catch (error) {
    console.error("Error fetching study place by id", error);
    return res.status(500).json({ error: "Failed to fetch study place." });
  }
};

export const getFiltered= async (req: Request, res: Response) => {
  const {
    wifiSpeed,
    noiseLevel,
    powerAvailability,
    placeType,
    workingHours,
    sort
  } = req.query;

  try {
    const places = await getStudyPlacesFiltered({
      wifiSpeed: wifiSpeed as string,
      noiseLevel: noiseLevel as string,
      powerAvailability: powerAvailability as string,
      placeType: placeType as string,
      workingHours: workingHours as string,
      sort: sort as string
    });

    return res.status(200).json(places);
  } catch (error) {
    console.error("Error filtering study places", error);
    return res.status(500).json({ error: "Failed to filter study places." });
  }
};

