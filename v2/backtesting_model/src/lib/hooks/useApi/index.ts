import { useCryptoApi } from "./cryptoApi";
import { MarketAsset, CryptoAsset } from "./types";

export const EMPTY_ASSET: MarketAsset = {
    symbol: '',
    start_date: new Date(),
    provider: '',
    title: () => '',
    description: () => ''
}

export { useCryptoApi };
export type { MarketAsset, CryptoAsset };
