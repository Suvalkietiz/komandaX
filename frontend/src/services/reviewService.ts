export interface CreateReviewInput {
  study_place_id: number;
  nickname: string;
  rating: number;
  text: string;
}

export async function createReview(data: CreateReviewInput): Promise<any> {
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
