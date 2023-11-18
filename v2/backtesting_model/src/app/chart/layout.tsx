'use client'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ParentComponentProperties } from "../types";
import { Upload } from "lucide-react";
import { open } from "@tauri-apps/api/dialog";
import { useRef, useState, Fragment } from "react";
import { TimeFrame, TimeFrames } from "./types";
import Selection, { SelectReference } from "@/components/selector";
import { Dialog, Transition } from "@headlessui/react";
import { ImportDataModal } from "@/components/importDataModal";
import { DataSetType, useDataSet } from "@/lib/hooks/useData";
import { DataSetInfo } from "@/lib/hooks/useData/types";

export default function ChartLayout(properties: ParentComponentProperties) {
    const indicators = useDataSet(DataSetType.Indicators);
    const markets = useDataSet(DataSetType.Markets);

    const [currentIndicator, updateIndicator] = useState(indicators.current())
    const [currentMarket, updateMarket] = useState(markets.current())

    const [currentTimeFrame, selectTimeFrame] = useState<TimeFrame>(localStorage.getItem("selected_time_frame")! as TimeFrame);

    const indicatorSelectRef = useRef<SelectReference>({})
    const marketSelectRef = useRef<SelectReference>({})

    const indicatorUploadRef = useRef<SelectReference>({})
    const marketUploadRef = useRef<SelectReference>({})

    function onIndicatorChanged(value: DataSetInfo) {
        updateIndicator(value);
        indicators.select_data_set(value);
    }

    function onMarketChanged(market: any) {
        updateMarket(market)
        markets.select_data_set(market)
    }

    function onTimeFrameChanged(timeFrame: TimeFrame) {
        localStorage.setItem("selected_time_frame", timeFrame);
        selectTimeFrame(timeFrame);
    }

    function openIndicatorSelect() {
        indicators.refresh().then(x => {
            indicatorSelectRef.current.Open?.();
        })
    }

    function openMarketSelect() {
        markets.refresh().then(x => {
            marketSelectRef.current.Open?.();
        })
    }

    return (
        <div className='min-w-full min-h-screen sm:flex sm:flex-row'>

            {/* Middle Section */}
            <div className="w-full min-h-screen dark:bg-stone-900 bg-stone-100">
                <div className='relative w-full h-full overflow-hidden'>
                    {properties.children}
                    <ImportDataModal type={DataSetType.Indicators} reference={indicatorUploadRef} onSuccess={onIndicatorChanged} />
                    <ImportDataModal type={DataSetType.Markets} reference={marketUploadRef} onSuccess={onMarketChanged} />
                    <Selection title='Select Market' onConfirmed={onMarketChanged} reference={marketSelectRef} values={markets.values} />
                    <Selection title="Select Indicator" onConfirmed={onIndicatorChanged} reference={indicatorSelectRef} values={indicators.values} />
                </div>
            </div>

            {/* Control Panel */}
            <div className='sm:border-l w-full flex-col flex sm:w-72 p-4 justify-between sm:h-screen  border-stone-200 bg-stone-100 transition-all dark:border-stone-700 dark:bg-stone-900'>
                <div className="grid gap-2 overflow-y-auto overflow-x-hidden">
                    {/* Header */}
                    <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
                        <h1 className="font-semibold dark:text-white">Settings</h1>
                    </div>
                    <div className="my-2 border-t border-stone-200 dark:border-stone-700" />

                    {/* Controls */}
                    <div className="px-2 grid gap-1">

                        {/* Market Options */}
                        <div className='w-full'>
                            <h4 className='dark:text-white  pb-4 text-sm text-black font-semibold'>Market Options</h4>
                            <div className='w-full p-4 border  border-stone-400 dark:border-stone-700 rounded-lg'>
                                <div className='w-full'>
                                    <p className='dark:text-stone-500 pb-2 font-semibold text-xs text-stone-400'>Market:</p>
                                    <Dropdown>
                                        <div className='w-full flex flex-row'>
                                            <DropdownTrigger>
                                                <Button variant="bordered" className="border-1 border-stone-300 dark:border-stone-700 capitalize grow text-left justify-start">
                                                    {currentMarket?.name}
                                                </Button>
                                            </DropdownTrigger>
                                            <Button onClick={async () => marketUploadRef.current.Open?.()} variant="bordered" className=" min-w-0 w-10 h-10 border-1 border-stone-300 dark:border-stone-700 ml-2 p-3 capitalize">
                                                <Upload className='w-10 h-10' />
                                            </Button>
                                        </div>
                                        <DropdownMenu
                                            aria-label="Single selection example"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={"none"}>
                                            <DropdownItem key="Select" onClick={() => {
                                                indicatorSelectRef.current.Close?.();
                                                openMarketSelect()
                                            }} className='dark:text-white text-black'>Select</DropdownItem>
                                            <DropdownItem key="Download" onClick={() => { }} className='dark:text-white text-black'>Download</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className='w-full pt-6'>
                                    <p className='dark:text-stone-500 pb-2 font-semibold text-xs text-stone-400'>Time Frame:</p>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button variant="bordered" className="capitalize w-full border-1 border-stone-300 dark:border-stone-700">
                                                {currentTimeFrame}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="Single selection example"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys="none">
                                            {TimeFrames.map((value) => (
                                                <DropdownItem key={value} variant='flat' className='dark:text-white text-black' onClick={(e) => onTimeFrameChanged(value)}>{value}</DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {/* Indicator Options */}
                        <div className='w-full pt-10'>
                            <h4 className='dark:text-white pb-4 text-sm text-black font-semibold'>Indicator Options</h4>
                            <div className='w-full p-4 border border-stone-400 dark:border-stone-700 rounded-lg'>
                                <div className='w-full'>
                                    <p className='dark:text-stone-500 pb-2 font-semibold text-xs text-stone-400'>Source:</p>
                                    <Dropdown>
                                        <div className='w-full flex flex-row'>
                                            <DropdownTrigger>
                                                <Button variant="bordered" className="border-1 border-stone-300 break-words overflow-hidden dark:border-stone-700 capitalize grow text-left justify-start">
                                                    {currentIndicator?.name}
                                                </Button>
                                            </DropdownTrigger>
                                            <Button onClick={async () => indicatorUploadRef.current.Open?.()} variant="bordered" className="border-1 border-stone-300 dark:border-stone-700 min-w-0 w-10 h-10 ml-2 p-3 capitalize">
                                                <Upload className='w-10 h-10' />
                                            </Button>
                                        </div>
                                        <DropdownMenu
                                            aria-label="Single selection example"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={"none"}>
                                            <DropdownItem key="Select" onClick={() => {
                                                marketSelectRef.current.Close?.();
                                                openIndicatorSelect();
                                            }} className='dark:text-white text-black'>Select</DropdownItem>
                                            <DropdownItem key="Download" onClick={() => { }} className='dark:text-white text-black'>Download</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
