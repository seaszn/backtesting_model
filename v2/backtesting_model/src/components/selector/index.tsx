import React from 'react';
import {
    Button,
} from "@nextui-org/react";
import { RefreshCcw, X } from 'lucide-react';
import { DataSetType, useDataSet } from '@/lib/hooks/useData';
import { validateConfig } from 'next/dist/server/config-shared';
import { data } from 'autoprefixer';
import { DataSetInfo } from '@/lib/hooks/useData/types';

export interface SelectReference {
    Open?: () => void
    Close?: () => void
}

interface SelectionProperties {
    type: DataSetType
    title: string
    intialState?: false
    className?: string
    onConfirmed?: (result: DataSetInfo) => void
    reference: React.MutableRefObject<SelectReference>
}

export default function Selection<T extends object>(properties: SelectionProperties) {
    const [selected, updateSelected] = React.useState<DataSetInfo | undefined>(undefined)
    const [isActive, setActive] = React.useState(properties.intialState ? properties.intialState : false);

    const dataSet = useDataSet(properties.type)
    const [values, updateValues] = React.useState(dataSet.values);

    properties.reference.current.Open = Open;
    properties.reference.current.Close = Close;

    React.useEffect(() => {
        onRefresh();
    }, []);

    function cancelSelection() {
        setActive(false);
    }

    function confirmSelection(value: DataSetInfo) {
        setActive(false);
        properties.onConfirmed?.(value);
    }

    function Open() {
        setActive(true)
    }

    function Close() {
        setActive(false);
    }

    function onRefresh(){
        dataSet.refresh().then(x => {
            updateValues(x);
        })
    }

    function formatClassess() {
        let result = properties.className != undefined ? properties.className : "";

        if (isActive) {
            result += "w-full p-10 blur-none"
        }
        else {
            result += "w-0 p-10 px-0 blur-sm"
        }

        return result;
    }

    return (
        <div className={formatClassess() + ' transition-all absolute top-0 z-20 bg-zinc-100 dark:bg-black h-full overflow-hidden'}>
            <div className='flex w-full'>
                <h3 className="my-auto min-w-max text-lg font-medium leading-6 text-black dark:text-white">
                    {properties.title}
                </h3>
                <span onClick={() => cancelSelection()} className='ml-auto text-black dark:text-white hover:bg-zinc-200 active:bg-zinc-300 dark:active:bg-zinc-800 rounded-full p-1 dark:hover:bg-zinc-700 '>
                </span>


                <div className='ml-auto flex'>
                    <Button className='my-auto mr-4'>
                        Import
                    </Button>
                    <span onClick={() => onRefresh()} className=' my-auto mr-4 text-black dark:text-white hover:bg-zinc-200 active:bg-zinc-300 dark:active:bg-zinc-800 rounded-full p-1 dark:hover:bg-zinc-700 '>
                        <RefreshCcw />
                    </span>

                    <span onClick={() => cancelSelection()} className='my-auto text-black dark:text-white hover:bg-zinc-200 active:bg-zinc-300 dark:active:bg-zinc-800 rounded-full p-1 dark:hover:bg-zinc-700 '>
                        <X />
                    </span>
                </div>
            </div>

            <div className='mt-4 max-h-80 overflow-y-auto'>
                <div className="flex flex-col gap-3 overflow-hidden">
                    <table className=' border-spacing-4 border-collapse' cellSpacing={"5px"}>
                        <thead className='pb-2 border-b border-zinc-200 dark:border-zinc-700'>
                            <tr className='font-semibold text-black dark:text-white p-2'>
                                {
                                    properties.type[0] == undefined ?
                                        (
                                            <></>
                                        ) :
                                        (
                                            Object.keys(properties.type[0]).map((value, index, source) => {
                                                return (<td key={index} className='p-1'>{value.replace("_", " ")}</td>)
                                            })
                                        )
                                }
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                values.map((value, index, source) => {
                                    return (
                                        <tr key={index} className={selected == value ? "dark:active:bg-zinc-800  dark:bg-zinc-700 dark:text-white text-black bg-zinc-300 text-sm my-4" : "" + 'cursor-pointer text-black text-sm transition-all dark:active:bg-zinc-800 active:bg-zinc-300 dark:text-white p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700'} onClick={(e) => {
                                            if (selected == value) {
                                                updateSelected(undefined)
                                            }
                                            else {
                                                updateSelected(value)
                                            }
                                        }} onDoubleClick={(e) => {
                                            confirmSelection(value);
                                        }} >
                                            {
                                                Object.values(value).map((x, i, s) => {
                                                    return (<td key={i} className={'py-3 p-1'}>{x}</td>)
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="absolute bottom-0 w-full pb-10">
                <Button disabled={selected == undefined} variant='bordered' className='enabled:hover:bg-zinc-500 enabled:active:bg-zinc-600 dark:enabled:hover:bg-zinc-700 dark:enabled:active:bg-zinc-800  disabled:opacity-50 transition-all' onClick={() => confirmSelection(selected!)}>
                    Confirm
                </Button>
                <Button variant='bordered' className=' ml-4 enabled:hover:bg-zinc-500 enabled:active:bg-zinc-600 dark:enabled:hover:bg-zinc-700 dark:enabled:active:bg-zinc-800 disabled:opacity-50 transition-all' onClick={() => cancelSelection()}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}