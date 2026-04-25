import { useState } from "react";
import { createReview, CreateReviewInput, Review } from "../services/reviewService";

interface ReviewFormProps {
  studyPlaceId: number;
  onReviewCreated?: (review: Review) => void;
}

export default function ReviewForm({ studyPlaceId, onReviewCreated }: ReviewFormProps) {
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const input: CreateReviewInput = {
        study_place_id: studyPlaceId,
        nickname,
        rating,
        text,
      };

      const createdReview = await createReview(input);

      setSuccess(true);
      setNickname("");
      setRating(5);
      setText("");

      onReviewCreated?.(createdReview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepavyko išsaugoti atsiliepimo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="review-form-header">
        <h2>Palikite atsiliepimą</h2>
        <p>Pasidalinkite savo patirtimi apie šią mokymosi vietą.</p>
      </div>

      <div className="review-field">
        <label htmlFor="nickname">Slapyvardis</label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          minLength={2}
          maxLength={32}
          placeholder="Pvz. Studentas123"
        />
      </div>

      <div className="review-field">
        <label htmlFor="rating">Įvertinimas</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        >
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>
              {val} ⭐
            </option>
          ))}
        </select>
      </div>

      <div className="review-field">
        <label htmlFor="text">Atsiliepimas</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          minLength={2}
          maxLength={500}
          placeholder="Parašykite, kas patiko arba ką būtų galima pagerinti..."
        />
      </div>

      <button type="submit" className="review-submit-button" disabled={loading}>
        {loading ? "Siunčiama..." : "Pateikti atsiliepimą"}
      </button>

      {success && <p className="review-success">Atsiliepimas išsaugotas.</p>}
      {error && <p className="review-error">{error}</p>}
    </form>
  );
}