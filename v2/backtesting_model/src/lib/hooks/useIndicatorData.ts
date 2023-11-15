import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

export interface IndicatorInfo {
    name: String,
    provider: String,
    url: String,
}

interface IndicatorState {
    all: IndicatorInfo[],
    current: () => IndicatorInfo | undefined,
    select: (indicator: IndicatorInfo) => void
    refresh: () => Promise<IndicatorInfo[]>
}

const initState: IndicatorState = {
    all: [],
    current: current,
    select: select,
    refresh: refresh
}

async function refresh() {
    try {
        let result = await invoke<IndicatorInfo[]>('on_load_indicator_data');
        return result;
    }
    catch (err) {
        return [];
    }
}

function select(indicator: IndicatorInfo) {
    localStorage.setItem("selected_indicator", JSON.stringify(indicator))
}

function current(): IndicatorInfo | undefined {
    const result = localStorage.getItem("selected_indicator")

    if (result == null) {
        return undefined
    }
    else {
        return JSON.parse(result);
    }
}

const useIndicatorData = () => {
    const [state, setState] = useState(initState);

    useEffect(() => {
        refresh().then(x => {
            setState({
                all: x,
                current,
                select,
                refresh
            });
        }).catch(x => {
            setState({
                all: [],
                current,
                select,
                refresh
            });
        })
    }, []);

    return state;
};

export const useIndicators = singletonHook(initState, useIndicatorData);
