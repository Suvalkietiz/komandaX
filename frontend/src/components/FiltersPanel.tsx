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
      <h4 className="filters-title">Filtrai</h4>

      <div className="filters-grid">

        <label className="filter-item">
          WiFi greitis
          <select
            value={filters.wifi_speed}
            onChange={(e) =>
              onChange({ ...filters, wifi_speed: e.target.value })
            }
          >
            <option value="">Visi</option>
            <option value="very_fast">Labai greitas</option>
            <option value="fast">Greitas</option>
            <option value="slow">Lėtas</option>
          </select>
        </label>

        <label className="filter-item">
          Triukšmo lygis
          <select
            value={filters.noise_level}
            onChange={(e) =>
              onChange({ ...filters, noise_level: e.target.value })
            }
          >
            <option value="">Visi</option>
            <option value="high">Aukštas</option>
            <option value="medium">Vidutinis</option>
            <option value="low">Žemas</option>
          </select>
        </label>

        <label className="filter-item">
          El. lizdų prieinamumas
          <select
            value={filters.power_availability}
            onChange={(e) =>
              onChange({ ...filters, power_availability: e.target.value })
            }
          >
            <option value="">Visi</option>
            <option value="sufficient">Pakankamas</option>
            <option value="insufficient">Nepakankamas</option>
          </select>
        </label>

        <label className="filter-item">
          Vietos tipas
          <select
            value={filters.place_type}
            onChange={(e) =>
              onChange({ ...filters, place_type: e.target.value })
            }
          >
            <option value="">Visi</option>
            <option value="cafe">Kavinė</option>
            <option value="bar">Baras</option>
            <option value="restaurant">Restoranas</option>
            <option value="library">Biblioteka</option>
            <option value="other">Kita</option>
          </select>
        </label>

        <label className="filter-item">
          Darbo valandos
          <select
            value={filters.working_hours}
            onChange={(e) =>
              onChange({ ...filters, working_hours: e.target.value })
            }
          >
            <option value="">Visi</option>
            <option value="morning">Rytas (6–12)</option>
            <option value="afternoon">Diena (12–18)</option>
            <option value="evening">Vakaras (18–24)</option>
          </select>
        </label>

      </div>
    </div>
  );
}
