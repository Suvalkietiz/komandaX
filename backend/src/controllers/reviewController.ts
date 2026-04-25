import type { Request, Response } from "express";
import { createReview, getReviewsByStudyPlaceId } from "../services/reviewService";

export const create = async (req: Request, res: Response) => {
  const { study_place_id, nickname, rating, text } = req.body || {};

  if (!study_place_id || !nickname || !rating || !text) {
    return res.status(400).json({ error: "Visi laukai privalomi." });
  }

  if (typeof study_place_id !== "number" || study_place_id <= 0) {
    return res.status(400).json({ error: "Netinkamas vietos identifikatorius." });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Įvertinimas turi būti nuo 1 iki 5." });
  }

  if (typeof nickname !== "string" || nickname.trim().length < 2) {
    return res.status(400).json({ error: "Slapyvardis per trumpas." });
  }

  if (typeof text !== "string" || text.trim().length < 2) {
    return res.status(400).json({ error: "Atsiliepimas per trumpas." });
  }

  try {
    const review = await createReview({
      study_place_id,
      nickname: nickname.trim(),
      rating,
      text: text.trim(),
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review", error);
    return res.status(500).json({ error: "Nepavyko išsaugoti atsiliepimo." });
  }
};

export const getByStudyPlace = async (req: Request, res: Response) => {
  const studyPlaceId = Number(req.params.studyPlaceId);

  if (!Number.isInteger(studyPlaceId) || studyPlaceId <= 0) {
    return res.status(400).json({ error: "Netinkamas vietos identifikatorius." });
  }

  try {
    const reviews = await getReviewsByStudyPlaceId(studyPlaceId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews", error);
    return res.status(500).json({ error: "Nepavyko įkelti atsiliepimų." });
  }
};