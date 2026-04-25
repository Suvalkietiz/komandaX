import "./FiltersPanel.css";

type Filters = {
  wifi_speed: string;
  noise_level: string;
  power_availability: string;
  place_type: string;
  working_hours: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function FiltersPanel({ filters, onChange }: Props) {
  return (
    <div className="filters-panel">
      <h4 className="filters-title">Filters</h4>

      <div className="filters-grid">

        <label className="filter-item">
          WiFi speed
          <select
            value={filters.wifi_speed}
            onChange={(e) =>
              onChange({ ...filters, wifi_speed: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="very_fast">Very fast</option>
            <option value="fast">Fast</option>
            <option value="slow">Slow</option>
          </select>
        </label>

        <label className="filter-item">
          Noise level
          <select
            value={filters.noise_level}
            onChange={(e) =>
              onChange({ ...filters, noise_level: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="filter-item">
          Power availability
          <select
            value={filters.power_availability}
            onChange={(e) =>
              onChange({ ...filters, power_availability: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="sufficient">Sufficient</option>
            <option value="insufficient">Insufficient</option>
          </select>
        </label>

        <label className="filter-item">
          Place type
          <select
            value={filters.place_type}
            onChange={(e) =>
              onChange({ ...filters, place_type: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
            <option value="restaurant">Restaurant</option>
            <option value="library">Library</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="filter-item">
          Working hours
          <select
            value={filters.working_hours}
            onChange={(e) =>
              onChange({ ...filters, working_hours: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="morning">Morning (6–12)</option>
            <option value="afternoon">Afternoon (12–18)</option>
            <option value="evening">Evening (18–24)</option>
          </select>
        </label>

      </div>
    </div>
  );
}