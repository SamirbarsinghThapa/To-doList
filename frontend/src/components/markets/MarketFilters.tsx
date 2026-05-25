import type { FilterType, SortType } from "../../types/market";

type Props = {
  filter: FilterType;
  sort: SortType;
  search: string;
  onFilterChange: (f: FilterType) => void;
  onSortChange: (s: SortType) => void;
  onSearchChange: (v: string) => void;
};

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: "volume", label: "Volume" },
  { value: "liquidity", label: "Liquidity" },
  { value: "startDate", label: "Newest" },
];

export default function MarketFilters({
  filter, sort, search,
  onFilterChange, onSortChange, onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
          width="14" height="14" viewBox="0 0 14 14" fill="none"
        >
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search markets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Filter tabs */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-0.5">
          {filterOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                filter === value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-400">Sort:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-indigo-300 transition-all"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
