import { FormEvent, useState } from "react";

type FormValues = {
  wifiSpeed: "slow" | "fast" | "very_fast" | "";
  noiseLevel: "low" | "medium" | "high" | "";
  powerAvailability: "insufficient" | "sufficient" | "";
  placeType: "cafe" | "bar" | "restaurant" | "library" | "other" | "";
  workingHours: string;
  description: string;
};

export function NewStudyPlace() {
  const [values, setValues] = useState<FormValues>({
    wifiSpeed: "",
    noiseLevel: "",
    powerAvailability: "",
    placeType: "",
    workingHours: "",
    description: ""
  });

  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/study-places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save study place.");
      }

      const saved = (await response.json()) as any;
      setSubmitted({
        wifiSpeed: saved.wifi_speed ?? values.wifiSpeed,
        noiseLevel: saved.noise_level ?? values.noiseLevel,
        powerAvailability: saved.power_availability ?? values.powerAvailability,
        placeType: saved.place_type ?? values.placeType,
        workingHours: saved.working_hours ?? values.workingHours,
        description: saved.description ?? values.description 
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save study place.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-container">
      <style>{`
        .form-container {
          max-width: 500px;
          margin: 2rem auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          color: #1a1a1a;
        }
        .form-title {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111;
          text-align: center;
        }
        .form-grid {
          display: grid;
          gap: 1.25rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .field span {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4b5563;
        }
        input, select, textarea {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          background: #f9fafb;
          transition: all 0.2s ease;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .submit-button {
          margin-top: 1rem;
          padding: 0.875rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-button:hover:not(:disabled) {
          background: #4f46e5;
        }
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-box {
          margin-top: 1rem;
          padding: 1rem;
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          color: #b91c1c;
          font-size: 0.875rem;
        }
        .summary-card {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f0fdf4;
          border-radius: 12px;
          border: 1px solid #dcfce7;
        }
        .summary-card h2 {
          font-size: 1.1rem;
          color: #166534;
          margin-top: 0;
        }
        .summary-item {
          font-size: 0.9rem;
          margin: 0.4rem 0;
          color: #14532d;
        }
      `}</style>

      <h1 className="form-title">Add Study Place</h1>
      
      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          <span>WiFi Speed</span>
          <select
            value={values.wifiSpeed}
            onChange={(e) => handleChange("wifiSpeed", e.target.value)}
            required
          >
            <option value="">Select speed</option>
            <option value="slow">Slow</option>
            <option value="fast">Fast</option>
            <option value="very_fast">Very fast</option>
          </select>
        </label>

        <label className="field">
          <span>Noise Level</span>
          <select
            value={values.noiseLevel}
            onChange={(e) => handleChange("noiseLevel", e.target.value)}
            required
          >
            <option value="">Select level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="field">
          <span>Power Outlet Availability</span>
          <select
            value={values.powerAvailability}
            onChange={(e) => handleChange("powerAvailability", e.target.value)}
            required
          >
            <option value="">Select availability</option>
            <option value="insufficient">Insufficient</option>
            <option value="sufficient">Sufficient</option>
          </select>
        </label>

        <label className="field">
          <span>Place Type</span>
          <select
            value={values.placeType}
            onChange={(e) => handleChange("placeType", e.target.value)}
            required
          >
            <option value="">Select place type</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
            <option value="restaurant">Restaurant</option>
            <option value="library">Library</option>
            <option value="other">Other space</option>
          </select>
        </label>

        <label className="field">
          <span>Working Hours (HH:MM)</span>
          <input
            type="text"
            value={values.workingHours}
            onChange={(e) => handleChange("workingHours", e.target.value)}
            placeholder="09:00"
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Atmosphere, seating, etc."
            rows={3}
          />
        </label>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Study Place"}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {submitted && (
        <div className="summary-card">
          <h2>✅ Saved Successfully</h2>
          <p className="summary-item"><strong>WiFi:</strong> {submitted.wifiSpeed}</p>
          <p className="summary-item"><strong>Noise:</strong> {submitted.noiseLevel}</p>
          <p className="summary-item"><strong>Power:</strong> {submitted.powerAvailability}</p>
          <p className="summary-item"><strong>Type:</strong> {submitted.placeType}</p>
          <p className="summary-item"><strong>Hours:</strong> {submitted.workingHours}</p>
          {submitted.description && (
            <p className="summary-item"><strong>Info:</strong> {submitted.description}</p>
          )}
        </div>
      )}
    </div>
  );
}