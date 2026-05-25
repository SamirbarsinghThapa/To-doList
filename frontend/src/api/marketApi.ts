import type { PolymarketEvent } from "../types/market";

const POLYMARKET_BASE = `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/markets`;

export interface FetchEventsParams {
  limit?: number;
  offset?: number;
  filter?: "active" | "closed" | "all";
  order?: string;
}

export const fetchPolymarketEvents = async (
  params: FetchEventsParams = {}
): Promise<PolymarketEvent[]> => {
  const { limit = 10, offset = 0, filter = "active", order = "volume" } = params;

  const query = new URLSearchParams();
  query.set("limit", String(limit));
  query.set("offset", String(offset));
  query.set("order", order);
  query.set("ascending", "false");

  if (filter === "active") query.set("active", "true");
  else if (filter === "closed") query.set("closed", "true");

  const res = await fetch(`${POLYMARKET_BASE}/events?${query.toString()}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};