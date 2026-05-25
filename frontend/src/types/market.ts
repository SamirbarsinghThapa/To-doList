export type FilterType = "active" | "closed" | "all";
export type SortType = "volume" | "liquidity" | "startDate";

export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  volume: number;
  liquidity: number;
  commentCount: number;
  markets: PolymarketMarket[];
  tags: { id: string; label: string; slug: string }[];
}

export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  groupItemTitle: string;
  groupItemThreshold: string;
  questionID: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
}
