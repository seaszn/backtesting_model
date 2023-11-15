import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

export interface MarketInfo {
    name: String,
}

interface MarketState {
    all: MarketInfo[],
    currentMarket: () => MarketInfo | undefined
    selectMarket: (market: MarketInfo) => void
    refresh: () => Promise<MarketInfo[]>
    downloadCurrent: () => void
}

const initState: MarketState = {
    all: [],
    currentMarket,
    selectMarket,
    refresh,
    downloadCurrent
}

async function refresh() {
    try {
        return await invoke<MarketInfo[]>('on_load_market_data');
    }
    catch (err) {
        return [];
    }
}

function selectMarket(market: MarketInfo) {
    localStorage.setItem("selected_market", JSON.stringify(market))
}

function currentMarket(): MarketInfo | undefined {
    const result = localStorage.getItem("selected_market")

    if (result == null) {
        return undefined
    }
    else {
        return JSON.parse(result);
    }
}

function downloadCurrent() {

}

const useMarketData = () => {
    const [state, setState] = useState(initState);

    useEffect(() => {
        refresh().then(x => {
            setState({
                all: x,
                currentMarket,
                selectMarket,
                refresh,
                downloadCurrent
            });
        }).catch(x => {
            setState({
                all: [],
                currentMarket,
                selectMarket,
                refresh,
                downloadCurrent
            });
        })
    }, []);

    return state;
};

export const useMarkets = singletonHook(initState, useMarketData);
