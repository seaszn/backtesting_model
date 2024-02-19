'use client';

import { CrosshairOptions, GridOptions, HorzScaleOptions, IChartApi, LayoutOptions, PriceScaleOptions, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_CROSSHAIR_OPTIONS, DEFAULT_GRID_OPTIONS, DEFAULT_HORZ_SCALE_OPTIONS, DEFAULT_LAYOUT_OPTIONS, DEFAULT_PRICE_SCALE_OPTIONS } from "./defaults";

export interface TvChartProperties {
    layout?: LayoutOptions,
    grid?: GridOptions,
    crosshair?: CrosshairOptions,
    horzScale?: HorzScaleOptions,
    priceScale?: PriceScaleOptions,
}

export interface TvChartReference {

}

export function TvChart(properties: TvChartProperties) {
    // const [autoScale, setAutoScale] = useState(true);
    // const [logScale, setLogScale] = useState(false);

    const [layoutOptions, updateLayoutOptions] = useState<LayoutOptions>(properties?.layout || DEFAULT_LAYOUT_OPTIONS);
    const [gridOptions, updateGridOptions] = useState<GridOptions>(properties?.grid || DEFAULT_GRID_OPTIONS);
    const [crosshairOptions, updateCrosshairOptions] = useState<CrosshairOptions>(properties?.crosshair || DEFAULT_CROSSHAIR_OPTIONS);
    const [horzScaleOptions, updateHorzScaleOptions] = useState<HorzScaleOptions>(properties?.horzScale || DEFAULT_HORZ_SCALE_OPTIONS);
    const [priceScaleOptions, updatePriceScaleOptions] = useState<PriceScaleOptions>(properties?.priceScale || DEFAULT_PRICE_SCALE_OPTIONS);

    const chartContainerRef = useRef<any>();

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            layout: layoutOptions,
            grid: gridOptions,
            timeScale: horzScaleOptions,
            height: chartContainerRef.current.clientHeight,
            width: chartContainerRef.current.clientWidth,
            crosshair: crosshairOptions,
            rightPriceScale: priceScaleOptions
        });

        const lineSeries = chart.addLineSeries();
        lineSeries.setData([
            { time: '2019-04-11', value: 80.01 },
            { time: '2019-04-12', value: 96.63 },
            { time: '2019-04-13', value: 76.64 },
            { time: '2019-04-14', value: 81.89 },
            { time: '2019-04-15', value: 74.43 },
            { time: '2019-04-16', value: 80.01 },
            { time: '2019-04-17', value: 96.63 },
            { time: '2019-04-18', value: 76.64 },
            { time: '2019-04-19', value: 81.89 },
            { time: '2019-04-20', value: 74.43 },
        ]);

        chart.timeScale().fitContent();

        const resizeObserver = new ResizeObserver(() => {
            handleResize(chart);
        })
        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        }
    }, [layoutOptions, gridOptions, crosshairOptions, horzScaleOptions, priceScaleOptions]);

    function handleResize(chart: IChartApi) {
        if (chartContainerRef.current) {
            chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
        }
    }


    // useEffect(() => {
    //     updatePriceScaleOptions({
    //         ...priceScaleOptions,
    //         autoScale: autoScale,
    //         mode: logScale ? PriceScaleMode.Logarithmic : PriceScaleMode.Logarithmic
    //     })
    // }, [autoScale, logScale])

    return (
        <div className=' w-full h-full relative'>
            <div className={`w-full h-full`} ref={chartContainerRef}></div>
        </div>
    );
}
