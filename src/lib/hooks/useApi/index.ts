import { useMarketApi } from "./market/marketApi";
import { MarketAsset } from "./market/types";

export const EMPTY_ASSET: MarketAsset = {
    symbol: '',
    start_date: new Date(),
    provider: '',
    title: () => '',
    description: () => ''
}

export { useMarketApi };
export type { MarketAsset };
