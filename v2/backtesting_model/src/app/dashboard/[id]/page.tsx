'use client'

import { ChartReference } from "@/components/chart/types";
import { LayoutBuilder } from "@/components/layoutBuilder";
import { useChart } from "@/lib/hooks/useChart";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { HorzScaleOptions, Range, Time } from "lightweight-charts";
import { useEffect, useRef } from "react"
import { DashboardProperties } from "./types";

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

export default function DashboardPage(properties: DashboardProperties) {
    const dashboard = useDashboard(properties.params.id)
    // const f = useChart();


    function onChartVisibleRangeChanged(timeRange: Range<number>, id: number) {
        // switch (id) {
            // case priceChartRef.current.id?.():
            //     indicatorChartRef.current.setVisibleTimeRange?.(timeRange);
            //     break;
            // case priceChartRef.current.id?.():
            //     priceChartRef.current.setVisibleTimeRange?.(timeRange);
            //     break;
        // }
    }

    function onCrosshairMoved(value: number, time: Time, id: number) {
    //     switch (id) {
    //         case priceChartRef.current.id?.():
    //             indicatorChartRef.current.setCrosshairPosition?.(0, time);
    //             break;
    //         case indicatorChartRef.current.id?.():
    //             priceChartRef.current.setCrosshairPosition?.(0, time);
    //             break;
    //     }
    }

    return (
        <div className="w-full min-h-screen bg-red-500" >
            <LayoutBuilder/>
                {/* <ChartRenderer reference={priceChartRef} data={initialData} onCrosshairMoved={onCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} /> */}
        </div>
    )
}