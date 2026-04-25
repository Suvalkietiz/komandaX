import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { getReviewsByStudyPlaceId, Review } from "../services/reviewService";
import { getStudyPlaceById } from "../services/studyPlacesService";

type StudyPlaceDetailsResponse = {
  id: number;
  name: string;
  address: string;
  osm_id: string;
  lat: number;
  lon: number;
  verified: boolean;
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  place_type: string;
  working_hours: string;
  created_at: string;
};

function valueOrUnknown(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Nenurodyta";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Nenurodyta"
    : date.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

function renderStars(rating: number) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export default function StudyPlaceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [place, setPlace] = useState<StudyPlaceDetailsResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const studyPlaceId = Number(id);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return null;
    }

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  useEffect(() => {
    if (!id || Number.isNaN(studyPlaceId)) {
      setError("Vietos identifikatorius nerastas.");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const placeData = await getStudyPlaceById(id!);
        setPlace(placeData);
      } catch {
        setError("Nepavyko įkelti vietos informacijos.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, studyPlaceId]);

  useEffect(() => {
    if (!studyPlaceId || Number.isNaN(studyPlaceId)) {
      return;
    }

    async function loadReviews() {
      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const data = await getReviewsByStudyPlaceId(studyPlaceId);
        setReviews(data);
      } catch {
        setReviewsError("Nepavyko įkelti atsiliepimų.");
      } finally {
        setReviewsLoading(false);
      }
    }

    loadReviews();
  }, [studyPlaceId]);

  const handleReviewCreated = (review: Review) => {
    setReviews((currentReviews) => [review, ...currentReviews]);
  };

  if (loading) {
    return (
      <main className="place-details-page">
        <section className="place-details-card">
          <p className="place-loading">Kraunama vietos informacija...</p>
        </section>
      </main>
    );
  }

  if (error || !place) {
    return (
      <main className="place-details-page">
        <div className="place-details-container">
          <button className="place-back-button" onClick={() => navigate(-1)}>
            ← Grįžti atgal
          </button>

          <section className="place-details-card">
            <h1>Vietos informacija nerasta</h1>
            <p className="place-error">{error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="place-details-page">
      <div className="place-details-container">
        <button className="place-back-button" onClick={() => navigate(-1)}>
          ← Grįžti atgal
        </button>

        <section className="place-hero">
          <div>
            <p className="place-type">{valueOrUnknown(place.place_type)}</p>
            <h1>{place.name}</h1>
            <p className="place-address">{place.address}</p>
          </div>

          <div className="place-hero-side">
            <span className={place.verified ? "place-badge verified" : "place-badge"}>
              {place.verified ? "Patikrinta vieta" : "Nepatikrinta vieta"}
            </span>

            <div className="place-rating-summary">
              <span className="place-rating-number">
                {averageRating ? averageRating.toFixed(1) : "—"}
              </span>
              <span className="place-rating-stars">
                {averageRating ? renderStars(averageRating) : "☆☆☆☆☆"}
              </span>
              <span className="place-rating-count">
                {reviews.length === 1
                  ? "1 atsiliepimas"
                  : `${reviews.length} atsiliepimai`}
              </span>
            </div>
          </div>
        </section>

        <section className="place-info-grid">
          <article className="place-info-card">
            <span>🕒</span>
            <h2>Darbo laikas</h2>
            <p>{valueOrUnknown(place.working_hours)}</p>
          </article>

          <article className="place-info-card">
            <span>📶</span>
            <h2>Wi-Fi</h2>
            <p>{valueOrUnknown(place.wifi_speed)}</p>
          </article>

          <article className="place-info-card">
            <span>🔇</span>
            <h2>Triukšmo lygis</h2>
            <p>{valueOrUnknown(place.noise_level)}</p>
          </article>

          <article className="place-info-card">
            <span>🔌</span>
            <h2>Elektros lizdai</h2>
            <p>{valueOrUnknown(place.power_availability)}</p>
          </article>
        </section>

        <section className="place-details-card">
          <h2>Papildoma informacija</h2>

          <div className="place-details-list">
            <div>
              <span>Adresas</span>
              <strong>{valueOrUnknown(place.address)}</strong>
            </div>

            <div>
              <span>Vietos tipas</span>
              <strong>{valueOrUnknown(place.place_type)}</strong>
            </div>

            <div>
              <span>Koordinatės</span>
              <strong>
                {place.lat}, {place.lon}
              </strong>
            </div>

            <div>
              <span>Pridėta</span>
              <strong>{formatDate(place.created_at)}</strong>
            </div>
          </div>
        </section>

        <section className="reviews-layout">
          <div className="reviews-list-card">
            <div className="reviews-header">
              <div>
                <h2>Atsiliepimai</h2>
                <p>Vartotojų įvertinimai ir komentarai apie šią vietą.</p>
              </div>

              <div className="reviews-average-box">
                <strong>{averageRating ? averageRating.toFixed(1) : "—"}</strong>
                <span>{averageRating ? renderStars(averageRating) : "☆☆☆☆☆"}</span>
              </div>
            </div>

            {reviewsLoading && <p className="review-muted">Kraunami atsiliepimai...</p>}
            {reviewsError && <p className="review-error">{reviewsError}</p>}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="empty-reviews">
                <strong>Atsiliepimų dar nėra</strong>
                <p>Būkite pirmas, palikęs atsiliepimą apie šią vietą.</p>
              </div>
            )}

            {!reviewsLoading && reviews.length > 0 && (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <article key={review.id} className="review-card">
                    <div className="review-card-header">
                      <div>
                        <h3>{review.nickname}</h3>
                        <span>{formatDate(review.created_at)}</span>
                      </div>

                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <p>{review.text}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <ReviewForm studyPlaceId={place.id} onReviewCreated={handleReviewCreated} />
        </section>
      </div>
    </main>
  );
}