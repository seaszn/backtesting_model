import { ListItemValue } from "@/lib/modals/listSelectModal"

export interface MarketAsset extends ListItemValue  {
    symbol: string,
    start_date: Date,
    provider: string,
}

export interface CryptoAsset extends MarketAsset {
    networks: string[]
}

export interface MarketApiState<T extends MarketAsset> {
    assets: T[],
    refreshAssets: () => Promise<T[]>
}

