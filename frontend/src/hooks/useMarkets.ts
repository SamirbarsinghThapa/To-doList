import { useQuery } from "@tanstack/react-query";
import { fetchPolymarketEvents } from "../api/marketApi";
import type { FetchEventsParams } from "../api/marketApi";

export const useMarkets = (params: FetchEventsParams = {}) => {
  return useQuery({
    queryKey: ["markets", params],
    queryFn: () => fetchPolymarketEvents(params),
    staleTime: 60_000,
    retry: 1,
  });
};