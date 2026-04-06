import type { Request, Response } from "express";
import { createReview } from "../services/reviewService";

export const create = async (req: Request, res: Response) => {
  const { study_place_id, nickname, rating, text } = req.body || {};

  if (!study_place_id || !nickname || !rating || !text) {
    return res.status(400).json({ error: "Visi laukai privalomi." });
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Įvertinimas turi būti 1-5." });
  }
  if (typeof nickname !== "string" || nickname.length < 2) {
    return res.status(400).json({ error: "Slapyvardis per trumpas." });
  }
  if (typeof text !== "string" || text.length < 2) {
    return res.status(400).json({ error: "Atsiliepimas per trumpas." });
  }

  try {
    const review = await createReview({ study_place_id, nickname, rating, text });
    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review", error);
    return res.status(500).json({ error: "Nepavyko išsaugoti atsiliepimo." });
  }
};
