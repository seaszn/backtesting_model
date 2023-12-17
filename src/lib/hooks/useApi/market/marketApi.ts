import { TimeFrame } from "@/app/chart/types";
import { MarketAsset } from "..";
import { invoke } from "@tauri-apps/api/tauri";
import { MarketApiState } from "./types";
import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";

const INIT_STATE: MarketApiState<MarketAsset> = {
    assets: [],
    refreshAssets: () => refreshAssets(),
    getPriceHistory: (asset: MarketAsset, timeFrame: TimeFrame, startDate: number, endDate: number) => getPriceHistory(asset, timeFrame, startDate, endDate)
}

export async function getPriceHistory(asset: MarketAsset, timeFrame: TimeFrame, startDate: number, endDate: number) {
    try {
        // console.log(asset);
        await invoke('get_price_history', {
            asset: {
                symbol: asset.symbol,
                start_date: asset.start_date.valueOf(),
                provider: asset.provider
            },
            timeFrame: timeFrame.valueOf(),
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf()
        }).then(x => {
            // console.log(x)
        });
    }
    catch (err) {
        // console.log(err)
        return [];
    }
}

export async function refreshAssets(): Promise<MarketAsset[]> {
    try {
        return (await invoke<MarketAsset[]>('get_market_assets')).map(x => {
            return {
                symbol: x.symbol,
                start_date: new Date(x.start_date),
                provider: x.provider,
                title: () => x.symbol,
                description: () => x.provider,
            };
        })
    }
    catch (err) {
        return [];
    }
}


export function useMarketApi() {
    const internal = (() => {
        const [state, updateState] = useState(INIT_STATE);

        useEffect(() => {
            refreshAssets().then(assets => {
                updateState({
                    ...state,
                    assets
                })
            })
        }, []);

        return state;
    })

    return singletonHook(INIT_STATE, () => internal())();
}