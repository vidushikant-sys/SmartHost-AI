import { HOSTEL_TYPES } from "../../services/hostelService";

/**
 * Controlled filter bar. HostelList owns the filter state; this component
 * only renders inputs and reports changes upward.
 *
 * filters shape: { search, hostel_type, sortBy }
 * sortBy values : "newest" | "fee_asc" | "fee_desc" | "capacity_desc"
 */
export default function HostelFilters({ filters, onChange, onReset }) {
  function update(patch) {
    onChange({ ...filters, ...patch });
  }

  return (
    <div className="hostel-filters">
      <div className="hostel-filters__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by title or city..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>

      <label className="hostel-filters__select">
        <span>Type</span>
        <select
          value={filters.hostel_type}
          onChange={(e) => update({ hostel_type: e.target.value })}
        >
          <option value="">All types</option>
          {HOSTEL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="hostel-filters__select">
        <span>Sort by</span>
        <select value={filters.sortBy} onChange={(e) => update({ sortBy: e.target.value })}>
          <option value="newest">Newest first</option>
          <option value="fee_asc">Fee: Low to High</option>
          <option value="fee_desc">Fee: High to Low</option>
          <option value="capacity_desc">Capacity: High to Low</option>
        </select>
      </label>

      <button type="button" className="btn btn--ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
