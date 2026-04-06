export interface Review {
  id: number;
  study_place_id: number;
  nickname: string;
  rating: number; // 1-5
  text: string;
  created_at: string;
}
