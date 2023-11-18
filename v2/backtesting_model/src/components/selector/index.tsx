import React from 'react';
import {
    Button,
} from "@nextui-org/react";
import { X } from 'lucide-react';

export interface SelectReference {
    Open?: () => void
    Close?: () => void
}

interface SelectionProperties<T> {
    values: T[]
    title: string
    intialState?: false
    className?: string
    onConfirmed?: (result: T) => void
    reference: React.MutableRefObject<SelectReference>
}

export default function Selection<T extends object>(properties: SelectionProperties<T>) {
    const [selected, updateSelected] = React.useState<T | undefined>(undefined)
    const [isActive, setActive] = React.useState(properties.intialState ? properties.intialState : false);

    properties.reference.current.Open = Open;
    properties.reference.current.Close = Close;

    function cancelSelection() {
        setActive(false);
    }

    function confirmSelection(value: T) {
        setActive(false);
        properties.onConfirmed?.(value);
    }

    function Open() {
        setActive(true)
    }

    function Close() {
        setActive(false);
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
        <div className={formatClassess() + ' transition-all absolute top-0 z-20 bg-stone-100 dark:bg-stone-900 h-full overflow-hidden'}>
            <div className='flex w-full'>
                <h3 className="my-auto min-w-max text-lg font-medium leading-6 text-black dark:text-white">
                    {properties.title}
                </h3>
                <span onClick={() => cancelSelection()} className='ml-auto text-black dark:text-white hover:bg-stone-200 active:bg-stone-300 dark:active:bg-stone-800 rounded-full p-1 dark:hover:bg-stone-700 '>
                    <X />
                </span>
            </div>

            <div className='mt-4 max-h-80 overflow-y-auto'>
                <div className="flex flex-col gap-3 overflow-hidden">
                    <table className=' border-spacing-4 border-collapse' cellSpacing={"5px"}>
                        <thead className='pb-2 border-b border-stone-200 dark:border-stone-700'>
                            <tr className='font-semibold text-black dark:text-white p-2'>
                                {
                                    properties.values[0] == undefined ?
                                        (
                                            <></>
                                        ) :
                                        (
                                            Object.keys(properties.values[0]).map((value, index, source) => {
                                                return (<td  key={index} className='p-1'>{value.replace("_", " ")}</td>)
                                            })
                                        )
                                }
                            </tr>
                        </thead>
                        <tbody className=''>
                            {
                                properties.values.map((value, index, source) => {
                                    return (
                                        <tr key={index} className={selected == value ? "dark:active:bg-stone-800  dark:bg-stone-700 dark:text-white text-black bg-stone-300 text-sm my-4" : "" + 'cursor-pointer text-black text-sm transition-all dark:active:bg-stone-800 active:bg-stone-300 dark:text-white p-2 hover:bg-stone-200 dark:hover:bg-stone-700'} onClick={(e) => {
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
                <Button disabled={selected == undefined} variant='bordered' className='enabled:hover:bg-green-500 enabled:active:bg-green-600 dark:enabled:hover:bg-green-700 dark:enabled:active:bg-green-800  disabled:opacity-50 transition-all' onClick={() => confirmSelection(selected!)}>
                    Confirm
                </Button>
                <Button variant='bordered' className=' ml-4 enabled:hover:bg-red-500 enabled:active:bg-red-600 dark:enabled:hover:bg-red-700 dark:enabled:active:bg-red-800 disabled:opacity-50 transition-all' onClick={() => cancelSelection()}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}