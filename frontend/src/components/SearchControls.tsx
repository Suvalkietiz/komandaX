import SearchBar from "./SearchBar";
import "./searchControls.css";

type Props = {
  mode: "nearby" | "all";
  setMode: (v: "nearby" | "all") => void;

  sort: "distance" | "newest";
  onSortChange: (v: "distance" | "newest") => void;

  onSearch: (address: string) => void;
  showControls: boolean;
};

export function SearchControls({
  mode,
  setMode,
  sort,
  onSortChange,
  onSearch,
  showControls,
}: Props) {
  return (
    <div className="search-controls">
      <SearchBar onSearch={onSearch} />

      {showControls && (
        <div className="controls-row">
          <div className="control-group">
            <label>Rodyti</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "nearby" | "all")}
            >
              <option value="nearby">≤ 2 km</option>
              <option value="all">Visos vietos</option>
            </select>
          </div>

          <div className="control-group">
            <label>Rūšiuoti</label>
            <select
              data-testid="sort-select"
              value={sort}
              onChange={(e) =>
                onSortChange(e.target.value as "distance" | "newest")
              }
            >
              <option value="distance">Arčiausios</option>
              <option value="newest">Naujausios</option>
              <option value="rating">Geriausiai įvertintos</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}