import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

export interface MarketInfo {
    name: String,
}

interface MarketState {
    all: MarketInfo[],
    current: () => MarketInfo | undefined,
    select: (indicator: MarketInfo) => void
    refresh: () => Promise<MarketInfo[]>
}

const initState: MarketState = {
    all: [],
    current,
    select,
    refresh
}

async function refresh() {
    try {
        return await invoke<MarketInfo[]>('on_load_market_data');
    }
    catch (err) {
        return [];
    }
}

function select(indicator: MarketInfo) {
    localStorage.setItem("selected_market", JSON.stringify(indicator))
}

function current(): MarketInfo | undefined {
    const result = localStorage.getItem("selected_market")

    if (result == null) {
        return undefined
    }
    else {
        return JSON.parse(result);
    }
}

const useMarketData = () => {
    const [state, setState] = useState(initState);

    useEffect(() => {
        refresh().then(x => {
            setState({
                all: x,
                current,
                select,
                refresh: refresh
            });
        }).catch(x => {
            setState({
                all: [],
                current,
                select,
                refresh: refresh
            });
        })
    }, []);

    return state;
};

export const useMarkets = singletonHook(initState, useMarketData);
