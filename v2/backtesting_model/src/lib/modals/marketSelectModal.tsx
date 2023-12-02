import { IconButton } from "@/components/iconButton";
import { invoke } from "@tauri-apps/api/tauri";
import { Download } from "lucide-react";
import { useEffect } from 'react'

export interface Asset {
    symbol: string,
    start_date: string,
    source: string,
    source_name: string,
}

export interface CryptoAsset extends Asset {
    networks: string[]
}

interface MarketSelectProps {
    items: Asset[],
    value: Asset,
    onConfirm?: (date: Asset) => void,
    onCancel?: () => void,
}

export function MarketSelectModal(properties: MarketSelectProps) {
    return (
        <div className="grow flex justify-between rounded-b-md overflow-hidden flex-col" style={{ width: '55rem', height: "30rem" }}>
            <div className="grid p-2  m-2 ml-2 justify-evenly" style={{ gridTemplateColumns: '10rem 1fr 1.5rem' }}>
                <div className=" font-semibold text-zinc-500">
                    <h1>
                        Symbol
                    </h1>
                </div>
                <div className="grow text-zinc-500 font-semibold">
                    <h1>
                        Source
                    </h1>
                </div>
                <div className="w-6" />
            </div>
            <div className="grow overflow-y-auto overflow-x-hidden">
                {
                    properties.items.map((x, i) => {
                        return (
                            <div key={i} className={` relative w-full h-14 grid px-4 border-b justify-between border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${x == properties.value ? "bg-zinc-300 dark:bg-zinc-700" : ""}`} style={{ gridTemplateColumns: '1fr  1.5rem' }}>
                                <div onClick={() => properties.onConfirm?.(x)} className="grid py-4" style={{gridTemplateColumns : '10rem 1fr '}}>
                                    <td className=" my-auto" style={{ width: '10rem' }}>
                                        {x.symbol}
                                    </td>
                                    <td className=" grow my-auto">
                                        {x.source_name}
                                    </td>
                                </div>
                                <div className="py-4">
                                    <IconButton onClick={() => console.log('test')} className="absolute h-6 w-6 p-0" icon={<Download className="h-4 w-4" />} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}