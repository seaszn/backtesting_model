'use client'

import React, { useRef, useState } from 'react';
import ChartComponent from "@/components/chart";
import { LayoutOptions, GridOptions, ColorType, LineStyle, Time, HorzScaleOptions, Range, PriceScaleOptions, CrosshairLineOptions } from 'lightweight-charts'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Upload } from 'lucide-react';
import { open } from '@tauri-apps/api/dialog';
import Selection, { SelectReference } from '@/components/selector';
import { IndicatorInfo, useIndicators } from '@/lib/hooks/useIndicatorData';
import { MarketInfo, useMarkets } from '@/lib/hooks/useMarketData';
import { TimeFrame, TimeFrames } from './types';
import { DEFAULT_HORZ_SCALE_OPTIONS } from '@/components/chart';
import { ChartReference } from '@/components/chart/types';

//#region Chart Options

const gridOptions: GridOptions = {
    vertLines: {
        color: '#44403c',
        style: LineStyle.Solid,
        visible: true
    },
    horzLines: {
        color: '#44403c',
        style: LineStyle.Solid,
        visible: true
    }
}

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];

//#endregion

export default function Chart() {
    const indicators = useIndicators();
    const markets = useMarkets();
    const [currentTimeFrame, selectTimeFrame] = useState<TimeFrame>(localStorage.getItem("selected_time_frame")! as TimeFrame);

    const indicatorSelectRef = useRef<SelectReference>({})
    const marketSelectRef = useRef<SelectReference>({})

    const priceChartRef = useRef<ChartReference>({})
    const indicatorChartRef = useRef<ChartReference>({})

    const [currentIndicator, updateIndicator] = useState(indicators.current())
    const [currentMarket, updateMarket] = useState(markets.current())

    const horzScaleOptions: HorzScaleOptions = {
        ...DEFAULT_HORZ_SCALE_OPTIONS,
        visible: false,
    }

    function onIndicatorChanged(value: IndicatorInfo) {
        updateIndicator(value);
        indicators.select(value);
    }

    function onMarketChanged(market: MarketInfo) {
        updateMarket(market)
        markets.select(market)
    }

    function onTimeFrameChanged(timeFrame: TimeFrame) {
        localStorage.setItem("selected_time_frame", timeFrame);
        selectTimeFrame(timeFrame);
    }

    async function onUploadMarket() {
        const path = await open({
            multiple: false,
            filters: [{
                name: 'Market Data',
                extensions: ['csv', 'json']
            }]
        });

        if (path != null) {
            console.log(path)
        }
    }

    async function onUploadIndicator() {
        const path = await open({
            multiple: false,
            filters: [{
                name: 'Indicator Data',
                extensions: ['csv', 'json']
            }]
        });

        if (path != null) {
            console.log(path)
        }
    }

    function onChartVisibleRangeChanged(timeRange: Range<number>, id: number) {
        console.log(timeRange)
        switch (id) {
            case priceChartRef.current.id?.():
                indicatorChartRef.current.setVisibleTimeRange?.(timeRange);
                break;
            case indicatorChartRef.current.id?.():
                priceChartRef.current.setVisibleTimeRange?.(timeRange);
                break;
        }
    }

    function onCrosshairMoved(value: number, time: Time, id: number) {
        switch (id) {
            case priceChartRef.current.id?.():
                indicatorChartRef.current.setCrosshairPosition?.(0, time);
                break;
            case indicatorChartRef.current.id?.():
                priceChartRef.current.setCrosshairPosition?.(0, time);
                break;
        }
    }

    return (
        <div className='min-w-full min-h-screen sm:flex sm:flex-row'>
            {/* Middle Section */}
            <div className="w-full min-h-screen dark:bg-stone-900 bg-stone-100">
                <div className='relative w-full h-full overflow-hidden'>
                    <div className='min-h-screen w-full max-h-screen'>
                        <div onMouseOver={(e) => console.log('hover')} className='w-full border-t border-stone-200' style={{ height: "69.75vh" }}>
                            <ChartComponent id={0} reference={priceChartRef} data={initialData} grid={gridOptions} onCrosshairMoved={onCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} horzScale={horzScaleOptions} />
                        </div>
                        <div className='opacity-60 w-full dark:bg-stone-500' style={{ height: "0.5vh", boxShadow: "10px 10px" }} />
                        <div className='w-full' style={{ height: "29.75vh" }}>
                            <ChartComponent id={1} reference={indicatorChartRef} data={initialData} grid={gridOptions} onCrosshairMoved={onCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} />
                        </div>
                    </div>
                    {/* <div className='opacity-60 h-1 w-full absolute dark:bg-stone-500 z-10' style={{ bottom: "30vh" }} /> */}
                    <Selection title='Select Market' onConfirmed={onMarketChanged} reference={marketSelectRef} values={markets.all} />
                    <Selection title="Select Indicator" onConfirmed={onIndicatorChanged} reference={indicatorSelectRef} values={indicators.all} />
                </div>
            </div>

            {/* Control Panel */}
            <div className='sm:border-l w-full flex-col flex sm:w-72 p-4 justify-between sm:h-screen  border-stone-200 bg-stone-100 transition-all dark:border-stone-700 dark:bg-stone-900'>
                <div className="grid gap-2 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
                        <h1 className="font-semibold dark:text-white">Settings</h1>
                    </div>
                    <div className="my-2 border-t border-stone-200 dark:border-stone-700" />

                    {/* Controls */}
                    <div className="px-2 grid gap-1">

                        {/* Market Options */}
                        <div className='w-full'>
                            <h4 className='dark:text-white pb-2 text-sm text-black font-semibold'>Market Options</h4>
                            <div className='w-full p-4 border  border-stone-400 dark:border-stone-700 rounded-lg'>
                                <div className='w-full'>
                                    <p className='dark:text-stone-500 pb-2 font-semibold text-xs text-stone-400'>Market:</p>
                                    <Dropdown>
                                        <div className='w-full flex flex-row'>
                                            <DropdownTrigger>
                                                <Button variant="bordered" className="capitalize grow text-left justify-start">
                                                    {currentMarket?.name}
                                                </Button>
                                            </DropdownTrigger>
                                            <Button onClick={async () => onUploadMarket()} variant="bordered" className=" min-w-0 w-10 h-10 ml-2 p-3 capitalize">
                                                <Upload className='w-10 h-10' />
                                            </Button>
                                        </div>
                                        <DropdownMenu
                                            aria-label="Single selection example"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={"none"}>
                                            <DropdownItem key="Select" onClick={() => { indicatorSelectRef.current.Close?.(); marketSelectRef.current.Open?.() }} className='dark:text-white text-black'>Select</DropdownItem>
                                            <DropdownItem key="Download" onClick={markets.downloadCurrent} className='dark:text-white text-black'>Download</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className='w-full pt-6'>
                                    <p className='dark:text-stone-500 pb-2 font-semibold text-xs text-stone-400'>Time Frame:</p>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button variant="bordered" className="capitalize w-full">
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
                                                <DropdownItem key={value} className='dark:text-white text-black' onClick={(e) => onTimeFrameChanged(value)}>{value}</DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {/* Indicator Options */}
                        <div className='w-full pt-10'>
                            <h4 className='dark:text-white pb-2 text-sm text-black font-semibold'>Indicator Options</h4>
                            <div className='w-full p-4 border border-stone-400 dark:border-stone-700 rounded-lg'>
                                <div className='w-full'>
                                    <p className='dark:text-stone-500 pb-2 font-semibold text-xs text-stone-400'>Source:</p>
                                    <Dropdown>
                                        <div className='w-full flex flex-row'>
                                            <DropdownTrigger>
                                                <Button variant="bordered" className="capitalize grow text-left justify-start">
                                                    {currentIndicator?.name}
                                                </Button>
                                            </DropdownTrigger>
                                            <Button onClick={async () => onUploadIndicator()} variant="bordered" className=" min-w-0 w-10 h-10 ml-2 p-3 capitalize">
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
                                                indicatorSelectRef.current.Open?.()
                                            }} className='dark:text-white text-black'>Select</DropdownItem>
                                            <DropdownItem key="Download" onClick={indicators.downloadCurrent} className='dark:text-white text-black'>Download</DropdownItem>
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
