import { FormEvent, useState } from "react";

import { createStudyPlace } from "../services/studyPlacesService";

type FormValues = {
  name: string;
  address: string;
  wifiSpeed: "slow" | "fast" | "very_fast" | "";
  noiseLevel: "low" | "medium" | "high" | "";
  powerAvailability: "insufficient" | "sufficient" | "";
  placeType: "cafe" | "bar" | "restaurant" | "library" | "other" | "";
  workingHours: string;
};

export function NewStudyPlace() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    address: "",
    wifiSpeed: "",
    noiseLevel: "",
    powerAvailability: "",
    placeType: "",
    workingHours: ""
  });

  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const saved = await createStudyPlace(values);

      setSubmitted({
        name: (saved.name ?? values.name) as string,
        address: (saved.address ?? values.address) as string,
        wifiSpeed: (saved.wifi_speed ?? values.wifiSpeed) as FormValues["wifiSpeed"],
        noiseLevel: (saved.noise_level ?? values.noiseLevel) as FormValues["noiseLevel"],
        powerAvailability: (saved.power_availability ?? values.powerAvailability) as FormValues["powerAvailability"],
        placeType: (saved.place_type ?? values.placeType) as FormValues["placeType"],
        workingHours: saved.working_hours ?? values.workingHours
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to save study place.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="form">
        <label className="field">
          <span>Place name</span>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Central Library"
            required
          />
        </label>

        <label className="field">
          <span>Address</span>
          <input
            type="text"
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="e.g. Gedimino pr. 1, Vilnius"
            required
          />
        </label>

        <label className="field">
          <span>WiFi speed</span>
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
          <span>Noise level</span>
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
          <span>Power outlet availability</span>
          <select
            value={values.powerAvailability}
            onChange={(e) =>
              handleChange("powerAvailability", e.target.value)
            }
            required
          >
            <option value="">Select availability</option>
            <option value="insufficient">Insufficient</option>
            <option value="sufficient">Sufficient</option>
          </select>
        </label>

        <label className="field">
          <span>Place type</span>
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
          <span>Working hours (HH:MM)</span>
          <input
            type="text"
            value={values.workingHours}
            onChange={(e) => handleChange("workingHours", e.target.value)}
            placeholder="e.g. 09:00"
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            required
          />
        </label>

        <button type="submit" className="submit-button">
          {isSubmitting ? "Saving..." : "Save study place"}
        </button>
      </form>

      {error && (
        <div className="result">
          <strong>Error:</strong> {error}
        </div>
      )}

      {submitted && (
        <div className="result">
          <h2>Study place summary</h2>
          <p>
            <strong>Name:</strong> {submitted.name}
          </p>
          <p>
            <strong>Address:</strong> {submitted.address}
          </p>
          <p>
            <strong>WiFi speed:</strong> {submitted.wifiSpeed}
          </p>
          <p>
            <strong>Noise level:</strong> {submitted.noiseLevel}
          </p>
          <p>
            <strong>Power outlet availability:</strong>{" "}
            {submitted.powerAvailability}
          </p>
          <p>
            <strong>Place type:</strong> {submitted.placeType}
          </p>
          <p>
            <strong>Working hours:</strong> {submitted.workingHours}
          </p>
        </div>
      )}
    </div>
  );
}

