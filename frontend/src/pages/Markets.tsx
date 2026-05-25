import { useState, useMemo } from "react";
import { useMarkets } from "../hooks/useMarkets";
import MarketCard from "../components/markets/MarketCard";
import MarketFilters from "../components/markets/MarketFilters";
import PageHeader from "../components/layout/PageHeader";

type FilterType = "active" | "closed" | "all";
type SortType = "volume" | "liquidity" | "startDate";

export default function Markets() {
  const [filter, setFilter] = useState<FilterType>("active");
  const [sort, setSort] = useState<SortType>("volume");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

const queryParams = useMemo(() => ({
  limit: PAGE_SIZE,
  offset: page * PAGE_SIZE,
  filter,
  order: sort,
}), [filter, sort, page]);

  const { data: events = [], isLoading, isError, refetch } = useMarkets(queryParams);

  const filtered = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.tags?.some((t) => t.label.toLowerCase().includes(q))
    );
  }, [events, search]);

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
    setPage(0);
  };

  const handleSortChange = (s: SortType) => {
    setSort(s);
    setPage(0);
  };

  return (
    <>
      <PageHeader
        title="Polymarket"
        subtitle="Live prediction markets from Polymarket"
        badge={{ label: `${filtered.length} markets`, color: "blue" }}
        actions={
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5A4.5 4.5 0 112 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M11 3.5V6.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
        }
      />

      <MarketFilters
        filter={filter}
        sort={sort}
        search={search}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <svg className="animate-spin w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-gray-400">Loading markets…</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#f87171" strokeWidth="1.7" />
              <path d="M10 6v5M10 13.5v.5" stroke="#f87171" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm text-red-400 font-medium">Failed to load markets</p>
          <p className="text-xs text-gray-400 mt-1">Polymarket API may be unavailable or CORS-blocked.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 text-xs font-medium text-indigo-500 hover:text-indigo-700 underline"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">No markets found.</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-xs text-indigo-500 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((event) => (
              <MarketCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </button>
            <span className="text-xs text-gray-400">Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={events.length < PAGE_SIZE}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Attribution */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-gray-300">
          Data from{" "}
          <a
            href="https://polymarket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 hover:text-indigo-500 transition-colors"
          >
            Polymarket
          </a>{" "}
          via gamma-api.polymarket.com
        </p>
      </div>
    </>
  );
}
