'use client'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ParentComponentProperties } from "../types";
import { BarChart2, Cog, Upload } from "lucide-react";
import { useRef, useState, Fragment, MutableRefObject } from "react";
import { TimeFrame, TimeFrames } from "./types";
import Selection, { SelectReference } from "@/components/selector";
import { ImportDataModal } from "@/components/importModal";
import { DataSetType, useDataSet } from "@/lib/hooks/useData";
import { DataSetInfo } from "@/lib/hooks/useData/types";
import { ConfigurationWindow } from "@/components/toolbarWindows/config";

enum ToolbarState {
    Collapsed = "",
    Configuration = "configuration",
    Analytics = "analytics"
}

export default function ChartLayout(properties: ParentComponentProperties) {
    const indicators = useDataSet(DataSetType.Indicators);
    const markets = useDataSet(DataSetType.Markets);

    const [toolbarState, setToolbarState] = useState(ToolbarState.Configuration);
    const [currentIndicator, updateIndicator] = useState(indicators.current())
    const [currentMarket, updateMarket] = useState(markets.current())
    const [currentTimeFrame, selectTimeFrame] = useState<TimeFrame>(localStorage.getItem("selected_time_frame")! as TimeFrame);

    const indicatorSelectRef = useRef<SelectReference>({})
    const marketSelectRef = useRef<SelectReference>({})

    const indicatorUploadRef: MutableRefObject<SelectReference> = useRef<SelectReference>({})
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
        <div className='min-w-full min-h-screen flex flex-row-reverse'>
            <div className="w-auto sm:border-l-4 min-h-screen z-30 flex flex-row-reverse border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-700 dark:bg-zinc-900">
                <div className=' border-l w-0 sm:w-14 p-0 overflow-hidden  sm:p-2 sm:pt-4 justify-between h-screen  border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-700 dark:bg-zinc-900'>
                    <Button onClick={() => setToolbarState(toolbarState == ToolbarState.Configuration ? ToolbarState.Collapsed : ToolbarState.Configuration)} variant="bordered" className={"border-1 border-zinc-300 dark:border-zinc-700 min-w-0 w-10 h-10 p-2 capitalize "}>
                        <Cog className='w-10 h-10' />
                    </Button>
                    <Button onClick={() => setToolbarState(toolbarState == ToolbarState.Analytics ? ToolbarState.Collapsed : ToolbarState.Analytics)} variant="bordered" className={"border-1 border-zinc-300 dark:border-zinc-700 min-w-0 w-10 h-10 p-2 capitalize mt-2 "}>
                        <BarChart2 className='w-10 h-10' />
                    </Button>
                </div>

                <div className={'z-30 transition-all bg-zinc-100 dark:bg-zinc-900 hidden sm:flex flex-col overflow-hidden justify-between h-screen ' + (toolbarState == ToolbarState.Collapsed ? "w-0 p-0" : " w-80")}>
                    {
                        {
                            'configuration': <ConfigurationWindow/>,
                            // 'analytics': <Bar />
                        }[toolbarState.valueOf()]
                    }
                </div>
            </div>
            {/* <div className={'z-30 hidden sm:flex flex-col overflow-hidden justify-between h-screen ' + (toolbarState == ToolbarState.Collapsed ? "w-0 p-0" : "w-72 p-4")}>
                 <div className="grid gap-2">
                {/*    <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
                        <h1 className="font-semibold dark:text-white">Settings</h1>
                    </div>
                    <div className="my-2 border-t border-zinc-200 dark:border-zinc-700" />

                    <div className="px-2 grid gap-1">
                        <div className='w-full'>
                            <h4 className='dark:text-white  pb-4 text-sm text-black font-semibold'>Market Options</h4>
                            <div className='w-full p-4 border  border-zinc-400 dark:border-zinc-700 rounded-lg'>
                                <div className='w-full'>
                                    <p className='dark:text-zinc-500 pb-2 font-semibold text-xs text-zinc-400'>Market:</p>
                                    <Dropdown>
                                        <div className='w-full flex flex-row'>
                                            <DropdownTrigger>
                                                <Button variant="bordered" className="border-1 border-zinc-300 dark:border-zinc-700 capitalize grow text-left justify-start">
                                                    {currentMarket?.name}
                                                </Button>
                                            </DropdownTrigger>
                                            <Button onClick={async () => marketUploadRef.current.Open?.()} variant="bordered" className=" min-w-0 w-10 h-10 border-1 border-zinc-300 dark:border-zinc-700 ml-2 p-3 capitalize">
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
                                    <p className='dark:text-zinc-500 pb-2 font-semibold text-xs text-zinc-400'>Time Frame:</p>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button variant="bordered" className="capitalize w-full border-1 border-zinc-300 dark:border-zinc-700">
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

                        <div className='w-full pt-10'>
                            <h4 className='dark:text-white pb-4 text-sm text-black font-semibold'>Indicator Options</h4>
                            <div className='w-full'>
                                <p className='dark:text-zinc-500 pb-2 font-semibold text-xs text-zinc-400'>Source:</p>
                                <Dropdown>
                                    <div className='w-full flex flex-row'>
                                        <DropdownTrigger>
                                            <Button variant="bordered" className="border-1 border-zinc-300 break-words overflow-hidden dark:border-zinc-700 capitalize grow text-left justify-start">
                                                {currentIndicator?.name}
                                            </Button>
                                        </DropdownTrigger>
                                        <Button onClick={async () => indicatorUploadRef.current.Open?.()} variant="bordered" className="border-1 border-zinc-300 dark:border-zinc-700 min-w-0 w-10 h-10 ml-2 p-3 capitalize">
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
            </div> */}

            {/* Middle Section */}
            <div className="grow relative min-h-screen dark:bg-zinc-900 bg-zinc-100">
                {properties.children}
                <ImportDataModal type={DataSetType.Indicators} reference={indicatorUploadRef} onSuccess={onIndicatorChanged} />
                <ImportDataModal type={DataSetType.Markets} reference={marketUploadRef} onSuccess={onMarketChanged} />
                <Selection title='Select Market' onConfirmed={onMarketChanged} reference={marketSelectRef} type={DataSetType.Markets} />
                <Selection title="Select Indicator" onConfirmed={onIndicatorChanged} reference={indicatorSelectRef} type={DataSetType.Indicators} />
            </div>


        </div>
    )
}
