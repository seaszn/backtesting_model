import { IconButton } from "@/components/iconButton";
import { invoke } from "@tauri-apps/api/tauri";
import { Download } from "lucide-react";
import { useEffect } from 'react'

export interface MarketInfo {
    symbol: string,
    name: string,
    source: string,
}

interface MarketSelectProps {
    items: MarketInfo[],
    value: MarketInfo,
    onConfirm?: (date: MarketInfo) => void,
    onCancel?: () => void,
}

export function MarketSelectModal(properties: MarketSelectProps) {
    return (
        <div className="grow flex justify-between rounded-b-md overflow-hidden flex-col" style={{ width: '55rem', height: "30rem" }}>
            <div className="grid p-2  m-2 ml-2 justify-evenly" style={{ gridTemplateColumns: '10rem 1fr 1fr 1.5rem' }}>
                <div className=" font-semibold text-zinc-500">
                    <h1>
                        Symbol
                    </h1>
                </div>
                <div className="grow  text-zinc-500 font-semibold">
                    <h1>
                        Name
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
                    properties.items.map(x => {
                        return (
                            <div onClick={() => properties.onConfirm?.(x)} className={`w-full h-14 grid px-4 py-4 border-b justify-between border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${x == properties.value ? "bg-zinc-300 dark:bg-zinc-700" : ""}`} style={{ gridTemplateColumns: '10rem 1fr 1fr 1.5rem' }}>
                                <td className=" my-auto" style={{ width: '10rem' }}>
                                    {x.symbol}
                                </td>
                                <td className=" grow my-auto">
                                    {x.name}
                                </td>
                                <td className=" grow my-auto">
                                    {x.source}
                                </td>
                                <div>
                                    <IconButton className="h-6 w-6 p-0" icon={<Download className="h-4 w-4" />} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}