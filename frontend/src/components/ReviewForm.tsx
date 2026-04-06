import { useState } from "react";
import { createReview, CreateReviewInput } from "../services/reviewService";

interface ReviewFormProps {
  studyPlaceId: number;
}

export default function ReviewForm({ studyPlaceId }: ReviewFormProps) {
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
      await createReview(input);
      setSuccess(true);
      setNickname("");
      setRating(5);
      setText("");
      // Pranešimas naršyklėje
      if (window && window.alert) {
        window.alert("Atsiliepimas sėkmingai paliktas!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepavyko išsaugoti atsiliepimo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-4 border rounded bg-gray-50 max-w-xl mx-auto">
      <h2 className="font-semibold mb-2">Palikite atsiliepimą</h2>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Slapyvardis</label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          required
          minLength={2}
          maxLength={32}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Įvertinimas</label>
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          required
          className="border rounded px-2 py-1 w-full"
        >
          {[5,4,3,2,1].map(val => (
            <option key={val} value={val}>{val} ⭐</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Atsiliepimas</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          required
          minLength={2}
          maxLength={500}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Siunčiama..." : "Pateikti atsiliepimą"}
      </button>
      {success && <div className="text-green-600 mt-2">Atsiliepimas išsaugotas!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
