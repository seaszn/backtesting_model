import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react"
import { singletonHook } from "react-singleton-hook"
import { MarketApiState, CryptoAsset, MarketAsset } from "./types";

const INIT_STATE: MarketApiState<CryptoAsset> = {
    assets: [],
    refreshAssets: () => refreshAssets(),
}

async function refreshAssets(): Promise<CryptoAsset[]> {
    try {
        return (await invoke('get_crypto_assets') as any).map((x: any) => {
            return {
                symbol: x.symbol,
                start_date: new Date(x.start_date),
                provider: x.provider,
                networks: x.networks,
                title: () => x.symbol,
                description: () => x.provider,
            };
        })
    }
    catch (err) {
        return [];
    }
}

function useCryptoApi() {
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

export { useCryptoApi };

