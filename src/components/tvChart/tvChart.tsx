'use client';

import { CrosshairOptions, DeepPartial, GridOptions, HorzScaleOptions, IChartApi, ISeriesApi, InternalHorzScaleItem, LayoutOptions, LineData, LineSeriesOptions, LineStyleOptions, MouseEventParams, PriceScaleMode, PriceScaleOptions, Range, SeriesMarker, SeriesOptionsCommon, Time, WhitespaceData, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_CROSSHAIR_OPTIONS, DEFAULT_GRID_OPTIONS, DEFAULT_HORZ_SCALE_OPTIONS, DEFAULT_LAYOUT_OPTIONS, DEFAULT_PRICE_SCALE_OPTIONS } from "./defaults";
import { TimeSeries } from "@/app/types";
import { useGlobalChartState } from "./useChartState";

export interface TvChartProperties {
    data: TimeSeries;
    markers?: SeriesMarker<Time>[],
    equityCurve?: TimeSeries;
    criticalSeries?: TimeSeries;
    layout?: LayoutOptions,
    grid?: GridOptions,
    crosshair?: CrosshairOptions,
    horzScale?: HorzScaleOptions,
    priceScale?: PriceScaleOptions,
    defaultLog?: boolean
    showTimeScale: boolean;
}

type LineSeriesApi = ISeriesApi<"Line", Time, LineData<Time> | WhitespaceData<Time>, LineSeriesOptions, DeepPartial<LineStyleOptions & SeriesOptionsCommon>>;

export interface TvChartReference {
}

export function TvChart(properties: TvChartProperties) {
    const globalState = useGlobalChartState();

    const [mouseOver, updateMouseOver] = useState(false);
    const [autoScale, setAutoScale] = useState(true);
    const [logScale, setLogScale] = useState(properties.defaultLog || false);

    const [layoutOptions] = useState<LayoutOptions>(properties?.layout || DEFAULT_LAYOUT_OPTIONS);
    const [gridOptions] = useState<GridOptions>(properties?.grid || DEFAULT_GRID_OPTIONS);
    const [crosshairOptions] = useState<CrosshairOptions>(properties?.crosshair || DEFAULT_CROSSHAIR_OPTIONS);
    const [priceScaleOptions, updatePriceScaleOptions] = useState<PriceScaleOptions>(properties?.priceScale || DEFAULT_PRICE_SCALE_OPTIONS);

    const [chart, updateChart] = useState<IChartApi>();
    const [dataSeries, updateDataSeries] = useState<LineSeriesApi>();
    const [criticalSeries, updateCriticalSeries] = useState<LineSeriesApi>();
    const [equitySeries, updateEquitySeries] = useState<LineSeriesApi>();

    const chartContainerRef = useRef<any>();

    useEffect(() => {
        if (globalState) {
            globalState.addListener('crosshair', onGlobalCrosshairMove);
            globalState.addListener('visible-range', onGlobalVisibleRangeChanged);
            chart?.subscribeCrosshairMove(onCrosshairMove);
            chart?.timeScale().subscribeVisibleTimeRangeChange(onVisibleRangeChanged);

            return () => {
                globalState.removeListener('crosshair', onGlobalCrosshairMove);
                globalState.removeListener('visible-range', onGlobalVisibleRangeChanged);
                chart?.unsubscribeCrosshairMove(onCrosshairMove);
                chart?.timeScale().unsubscribeVisibleTimeRangeChange(onVisibleRangeChanged);
            }
        }
    }, [globalState, chart, onVisibleRangeChanged, onGlobalCrosshairMove])

    useEffect(() => {
        // Initialize the chart
        const chart = createChart(chartContainerRef.current, {
            localization: {
                dateFormat: 'yyyy/MM/dd',
            },
            
            layout: layoutOptions,
            grid: gridOptions,
            timeScale: {
                rightOffset:50,
                fixLeftEdge: false,
                fixRightEdge: true,
                rightBarStaysOnScroll: false,
                lockVisibleTimeRangeOnResize: false,
                visible: properties.showTimeScale,
                
            },
            height: chartContainerRef.current.clientHeight,
            width: chartContainerRef.current.clientWidth,
            crosshair: crosshairOptions,
            rightPriceScale: {
                ...priceScaleOptions,
                minimumWidth: 100
            },
            leftPriceScale: priceScaleOptions,
        });

        // Initialize the data series
        const dataSeries = chart.addLineSeries({
            color: '#4338ca',
            lineWidth: 2
        });
        dataSeries.setData(properties.data);
        updateDataSeries(dataSeries)

        // Initialize the critical series if defined
        if (properties.criticalSeries) {
            const series = chart.addLineSeries({
                lineWidth: 1,
                lineStyle: 1,
                color: '#ffffff'
            });

            series.setData(properties.criticalSeries);
            updateCriticalSeries(series);
        }

        // Initialize the equity series if defined
        if (properties.equityCurve) {
            
            const series = chart.addLineSeries({
                priceScaleId: 'left',
                lineWidth: 2,
                color: '#ffffff'
            });

            series.setData(properties.equityCurve);
            updateEquitySeries(series);
        }

        if(properties.markers){
            dataSeries.setMarkers(properties.markers)
        }

        // Subscribe to the crosshair move event
        chart.subscribeCrosshairMove(onCrosshairMove);

        // Initialize the resize observer
        const resizeObserver = new ResizeObserver(() => {
            handleResize(chart);
        })
        resizeObserver.observe(chartContainerRef.current);

        // Stet the current chart
        chart.timeScale().fitContent()
        updateChart(chart);

        // Unsubscribe all events on unmount
        return () => {
            resizeObserver.disconnect();

            chart.unsubscribeCrosshairMove(onCrosshairMove);
            chart.remove();
        }
    }, [layoutOptions, gridOptions, crosshairOptions, priceScaleOptions]);

    useEffect(() => {
        if (properties.criticalSeries && criticalSeries) {
            criticalSeries.setData(properties.criticalSeries)
        }
    }, [properties.criticalSeries])

    useEffect(() => {
        if(properties.markers && dataSeries){
            dataSeries.setMarkers(properties.markers)
        }
    }, [properties.markers])

    useEffect(() => {
        if (properties.equityCurve && equitySeries) {
            equitySeries.setData(properties.equityCurve)
        }
    }, [properties.equityCurve])

    useEffect(() => {
        if (properties.data && dataSeries) {
            dataSeries.setData(properties.data)
        }
    }, [properties.data])

    useEffect(() => {
        updatePriceScaleOptions({
            ...priceScaleOptions,
            autoScale: autoScale,
            mode: logScale ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal
        })
    }, [autoScale, logScale])

    function onCrosshairMove(event: MouseEventParams<Time>) {
        if (event.time) {
            globalState.updateHorzCrosshair(event.time);
        }
    }
    
    function onVisibleRangeChanged(range: Range<Time> | null) {
        if (range) {
            globalState.updateVisibleRange(range);
        }
    }

    function onGlobalCrosshairMove(time: Time) {
        if (chart && dataSeries && !mouseOver) {
            chart.setCrosshairPosition(0, time, dataSeries)
        }
    }
    
    function onGlobalVisibleRangeChanged(time: Range<Time>) {
        if (chart && dataSeries) {
            chart.timeScale().setVisibleRange(time);
        }
    }

    function handleResize(chart: IChartApi) {
        if (chartContainerRef.current) {
            chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
        }
    }

    function getToggleButtonStyle(state: boolean) {
        if (state) {
            return 'bg-indigo-700 border-indigo-700 text-neutral-300'
        }

        return 'hover:bg-neutral-700 border-neutral-700'
    }

    return (
        <div onMouseEnter={() => updateMouseOver(true)} onMouseLeave={() => updateMouseOver(false)} className=" w-full h-full relative">
            <div className=" absolute flex z-40  justify-end bottom-2 bg-neutral-950  gap-1 p-1  right-2 w-12 h-8  text-neutral-500 hover:text-neutral-300">
                <button onClick={() => setAutoScale(!autoScale)} className={`h-5 w-5 transition-colors rounded-sm flex border mt-0.5 border-neutral-700`}>
                    <h1 className="text-sm m-auto font-semibold">A</h1>
                </button>
                <button onClick={() => setLogScale(!logScale)} className={`h-5 w-5 transition-colors rounded-sm  flex border mt-0.5 ${getToggleButtonStyle(logScale)}`}>
                    <h1 className="text-sm m-auto font-semibold">L</h1>
                </button>
            </div>
            <div className={`w-full h-full`} ref={chartContainerRef}></div>
        </div>
    );
}
