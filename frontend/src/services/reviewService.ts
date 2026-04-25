export interface CreateReviewInput {
  study_place_id: number;
  nickname: string;
  rating: number;
  text: string;
}

export interface Review {
  id: number;
  study_place_id: number;
  nickname: string;
  rating: number;
  text: string;
  created_at: string;
}

export async function createReview(data: CreateReviewInput): Promise<Review> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Nepavyko išsaugoti atsiliepimo.");
  }

  return response.json();
}

export async function getReviewsByStudyPlaceId(studyPlaceId: number): Promise<Review[]> {
  const response = await fetch(`/api/reviews/study-place/${studyPlaceId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Nepavyko įkelti atsiliepimų.");
  }

  return response.json();
}