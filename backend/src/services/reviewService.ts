import { db } from "../db/db";
import type { Review } from "../models/review";

export interface CreateReviewInput {
  study_place_id: number;
  nickname: string;
  rating: number;
  text: string;
}

export async function createReview(data: CreateReviewInput): Promise<Review> {
  const result = await db.query<Review>(
    `INSERT INTO reviews (study_place_id, nickname, rating, text, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, study_place_id, nickname, rating, text, created_at`,
    [data.study_place_id, data.nickname, data.rating, data.text]
  );
  return result.rows[0];
}
