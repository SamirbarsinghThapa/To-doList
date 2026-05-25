import type { PolymarketEvent } from "../../types/market";

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  event: PolymarketEvent;
};

export default function MarketCard({ event }: Props) {
  // Parse first market's outcomes/prices if available
  let outcomes: string[] = [];
  let prices: number[] = [];
  if (event.markets?.[0]) {
    try {
      outcomes = JSON.parse(event.markets[0].outcomes ?? "[]");
      prices = JSON.parse(event.markets[0].outcomePrices ?? "[]").map(Number);
    } catch (_e) {
      outcomes = [];
      prices = [];
    }
  }

  const yesIdx = outcomes.indexOf("Yes");
  const noIdx = outcomes.indexOf("No");
  const yesPrice = yesIdx >= 0 ? prices[yesIdx] : null;
  const noPrice = noIdx >= 0 ? prices[noIdx] : null;

  const isBinary = yesPrice !== null && noPrice !== null;
  const yesPct = yesPrice !== null ? Math.round(yesPrice * 100) : null;

  const polyUrl = `https://polymarket.com/event/${event.slug}`;

  return (
    <a
      href={polyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {event.icon ? (
          <img
            src={event.icon}
            alt=""
            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12l3-4 3 3 3-5 3 6" stroke="#6366f1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {event.title}
          </p>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {event.tags.slice(0, 3).map((tag) => (
                <span key={tag.id} className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Probability bar (binary markets) */}
      {isBinary && yesPct !== null && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-green-600">Yes {yesPct}%</span>
            <span className="font-semibold text-red-400">No {100 - yesPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all"
              style={{ width: `${yesPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Non-binary market outcomes */}
      {!isBinary && outcomes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {outcomes.slice(0, 4).map((outcome, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
              <span className="text-[11px] text-gray-600 font-medium">{outcome}</span>
              {prices[i] !== undefined && (
                <span className="text-[11px] font-bold text-indigo-600">
                  {Math.round(prices[i] * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 9V5M4 9V3M7 9V6M10 9V1" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-gray-400">{formatVolume(event.volume ?? 0)}</span>
        </div>
        {event.endDate && (
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="2" width="9" height="8" rx="1.5" stroke="#9ca3af" strokeWidth="1.3" />
              <path d="M1 5h9M4 1v2M7 1v2" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-gray-400">{formatDate(event.endDate)}</span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            event.closed ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"
          }`}>
            {event.closed ? "Closed" : "Active"}
          </span>
        </div>
      </div>
    </a>
  );
}
