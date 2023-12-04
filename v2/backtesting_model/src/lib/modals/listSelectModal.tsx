import { IconButton } from "@/components/iconButton";
import { invoke } from "@tauri-apps/api/tauri";
import { Download } from "lucide-react";
import { useEffect, useState } from 'react'
import { MarketAsset } from "../hooks/useApi";

export interface ListItemValue{
    title: () => string | undefined
    description: () => string | undefined
}

interface ListSelectProps<T> {
    items: T[],
    value: T,
    onConfirm?: (asset: T) => void,
    onCancel?: () => void,
}

export function ListSelectModal<T extends ListItemValue>(properties: ListSelectProps<T>) {
    return (
        <div className="grow pb-8 flex justify-between rounded-b-md overflow-hidden flex-col" style={{ width: '55rem', height: "30rem", background: "#52525b" }}>
            <div className="grid p-4 pl-6 bg-zinc-200 dark:bg-zinc-800 justify-evenly" style={{ gridTemplateColumns: '10rem 1fr 1.5rem' }}>
                <div className=" font-semibold rounded-full text-zinc-700  dark:text-zinc-300 underline">
                    <h1>
                        Symbol
                    </h1>
                </div>
                <div className=" font-semibold rounded-full text-zinc-700  dark:text-zinc-300 underline">
                    <h1>
                        Source
                    </h1>
                </div>
                <div className="w-6" />
            </div>
            <div className="grow mb-8 overflow-y-auto overflow-x-hidden bg-zinc-200 dark:bg-zinc-800">
                {
                    properties.items.map((x, i) => {
                        return (
                            <div key={i} className={` relative w-full h-14 grid px-4 border-b justify-between border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${x == properties.value ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`} style={{ gridTemplateColumns: '1fr  1.5rem' }}>
                                <div onClick={() => properties.onConfirm?.(x)} className="grid py-4" style={{gridTemplateColumns : '10rem 1fr '}}>
                                    <div className=" my-auto" style={{ width: '10rem' }}>
                                        {x.title()}
                                    </div>
                                    <div className=" grow my-auto">
                                        {x.description()}
                                    </div>
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