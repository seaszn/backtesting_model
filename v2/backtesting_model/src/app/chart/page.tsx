'use client'

import React, { useRef, useEffect } from 'react';
import ChartComponent from "@/components/chart";
import { Time, HorzScaleOptions, Range } from 'lightweight-charts'
import { DEFAULT_HORZ_SCALE_OPTIONS } from '@/components/chart';
import { ChartReference } from '@/components/chart/types';

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

export default function Chart() {
    const priceChartRef = useRef<ChartReference>({})
    const indicatorChartRef = useRef<ChartReference>({})
    const windowRef = useRef<any>();

    useEffect(() => {
        if (windowRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                priceChartRef.current.forceResize?.();
                indicatorChartRef.current.forceResize?.();

                console.log([windowRef.current.clientWidth, windowRef.current.clientHeight])
            });
            resizeObserver.observe(windowRef.current)

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [windowRef])

    const horzScaleOptions: HorzScaleOptions = {
        ...DEFAULT_HORZ_SCALE_OPTIONS,
        visible: false,
    }

    function onChartVisibleRangeChanged(timeRange: Range<number>, id: number) {
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
        <div className='grow flex flex-col m-2' ref={windowRef}>
            <div className='flex h-2/3 overflow-hidden'>
                <ChartComponent id={0} reference={priceChartRef} data={initialData} onCrosshairMoved={onCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} horzScale={horzScaleOptions} />
            </div>
            <div className='grow flex '>
                <ChartComponent id={1} reference={indicatorChartRef} data={initialData} onCrosshairMoved={onCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} />
            </div>

            {/* <div className='grow flex bg-blue-500 ' style={{ height: "69.75vh" }}> */}
            {/* <ChartComponent id={0} reference={priceChartRef} data={initialData} onCrosshairMoved={onCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} horzScale={horzScaleOptions} /> */}
            {/* </div> */}

            {/* <div className='w-full dark:bg-zinc-700' style={{ height: "0.5vh" }} />
            <div className='w-full' style={{ height: "29.75vh" }}>
            </div> */}
        </div>
    )
}
