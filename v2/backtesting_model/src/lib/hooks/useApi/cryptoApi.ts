import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react"
import { singletonHook } from "react-singleton-hook"
import { MarketApiState, CryptoAsset, MarketAsset } from "./types";

const INIT_STATE: MarketApiState<CryptoAsset> = {
    assets: [],
    refreshAssets: () => refreshAssets()
}

async function refreshAssets(): Promise<CryptoAsset[]> {
    try {
        const assets = await invoke<CryptoAsset[]>('get_crypto_assets');

        return assets.map(x => {
            return {
                ...x,
                title: () => x.symbol,
                description: () => x.source_name,
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

