import { TimeFrame } from "@/app/chart/types"
import { ListItemValue } from "@/lib/modals/listSelectModal"

export interface MarketAsset extends ListItemValue  {
    symbol: string,
    start_date: Date,
    provider: string,
}


export interface MarketApiState<T extends MarketAsset> {
    assets: T[],
    refreshAssets: () => Promise<T[]>,
    getPriceHistory: (asset: MarketAsset, timeFrame: TimeFrame, startDate: number, endDate: number) => Promise<any>
}

