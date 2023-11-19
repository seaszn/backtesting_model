import { useDataSet } from "@/lib/hooks/useData"
import { DataSetType } from "@/lib/hooks/useData/types"
import { data } from "autoprefixer"
import { useState } from "react"

interface DataSetSelectProps {
    type: DataSetType,
}

export function DataSetSelect(properties: DataSetSelectProps) {
    const dataSet = useDataSet(properties.type)
    const [selected, setSelected] = useState(dataSet.current());

    return (
        <div className="h-full w-full flex flex-col">
            <div className="w-full font-semibold border-b text-xs px-2 border-zinc-200 dark:border-zinc-700 text-zinc-300 dark:text-zinc-600 grid grid-cols-2">
                <p className='pb-2'>Name</p>
                <p className='text-end pb-2'>Provider</p>
            </div>
            <div className={"h-full w-full grow mb-4 overflow-y-auto"}>
                {
                    dataSet.values.map((value, index, source) => {
                        return (
                            <div key={index} onClick={() => setSelected(value)} className={(selected == value ? "dark:active:bg-zinc-800 dark:bg-zinc-700 dark:text-white text-black bg-zinc-300 text-xs" : "") + ' px-2 cursor-pointer text-black transition-all dark:active:bg-zinc-800 active:bg-zinc-300 dark:text-white p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-xs grid grid-cols-2'}>
                                <p className=''>{value.name}</p>
                                <p className='text-end'>{value.provider}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}