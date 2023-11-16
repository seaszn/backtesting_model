
import { createChart, ColorType, GridOptions, LayoutOptions, Time, TimeScaleOptions, HorzScaleOptions, Range, InternalHorzScaleItem, ISeriesApi, CrosshairOptions, LineStyle, CrosshairMode, CrosshairLineOptions, PriceScaleOptions, PriceScaleMode } from 'lightweight-charts';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import { TimeSeries, ChartReference, ChartProperties } from './types';

export const DEFAULT_PRICE_SCALE_OPTIONS: PriceScaleOptions ={
    autoScale: true,
    mode: PriceScaleMode.Normal,
    invertScale: false,
    alignLabels: true,
    scaleMargins: { bottom: 0.1, top: 0.2 },
    borderVisible: false,
    borderColor: '',
    entireTextOnly: false,
    visible: true,
    ticksVisible: false,
    minimumWidth: 0
}

export const DEFAULT_HORZ_SCALE_OPTIONS = {
    rightOffset: 0,
    barSpacing: 6,
    minBarSpacing: 0.5,
    fixLeftEdge: false,
    fixRightEdge: false,
    lockVisibleTimeRangeOnResize: false,
    rightBarStaysOnScroll: false,
    borderVisible: true,
    borderColor: "#2B2B43",
    visible: true,
    timeVisible: false,
    secondsVisible: true,
    shiftVisibleRangeOnNewBar: true,
    allowShiftVisibleRangeOnWhitespaceReplacement: false,
    ticksVisible: false,
    tickMarkMaxCharacterLength: undefined,
    minimumHeight: 0,
    uniformDistribution: true
}

export const DEFAULT_CROSSHAIR_LINE_OPTIONS: CrosshairLineOptions = {
    color: "#758696",
    labelBackgroundColor: 'white',
    width: 1,
    style: LineStyle.Dashed,
    visible: true,
    labelVisible: true
}

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    background: { type: ColorType.Solid, color: '#1c1917' },
    textColor: 'white',
    fontSize: 12,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`
}

export const DEFAULT_CHART_PROPERTIES: ChartProperties = {
    id: -1,
    data: [],
    layout: DEFAULT_LAYOUT_OPTIONS,
    crosshair: {
        vertLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
        horzLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
        mode: CrosshairMode.Normal
    },
    priceScale: DEFAULT_PRICE_SCALE_OPTIONS,
    horzScale: DEFAULT_HORZ_SCALE_OPTIONS
}

export default function ChartComponent(properties: ChartProperties) {
    const chartContainerRef = useRef<any>();

    const merged_properties: ChartProperties = {
        ...DEFAULT_CHART_PROPERTIES,
        ...properties
    }

    useEffect(() => {
        const handleResize = () => {
            chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight)
        };

        const chart = createChart(chartContainerRef.current, {
            layout: merged_properties.layout,
            grid: merged_properties.grid,
            timeScale: merged_properties.horzScale,
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: merged_properties.crosshair,
            rightPriceScale: merged_properties.priceScale
        });

        const newSeries = chart.addAreaSeries();
        newSeries.setData(merged_properties.data);

        // Setup Time Scale
        chart.timeScale().fitContent();
        chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange: Range<number> | null) => {
            if (timeRange) {
                const adjustedTimeRange: Range<number> = {
                    from: Math.max(-100, timeRange.from),
                    to: Math.min(merged_properties.data.length + 100, timeRange.to)
                }

                if(adjustedTimeRange != timeRange){
                    const timeScale = chart.timeScale();
                    timeScale.setVisibleLogicalRange(adjustedTimeRange)
                }

                properties.onVisibleRangeChanged?.(timeRange, properties.id);

            }
        })

        // Setup Cosshair
        let crosshairPosition: { value: number, time: Time } = { value: 0, time: "2018-01-01" };
        chart.subscribeCrosshairMove((event) => {
            const pointData: { value: number | undefined, time: Time } | undefined = event.seriesData.values().next().value;

            if (pointData) {
                if (pointData.value != undefined) {
                    crosshairPosition = { value: pointData.value, time: pointData.time };
                    
                    properties.onCrosshairMoved?.(pointData.value, pointData.time, properties.id);
                }
            }
            else{
                chart.setCrosshairPosition(crosshairPosition.value, crosshairPosition.time, newSeries)
            }
        });

        if (properties.reference != null) {
            properties.reference.current.id = () => properties.id

            properties.reference.current.setVisibleTimeRange = (timeRange) => {
                const timeScale = chart.timeScale();
                timeScale.setVisibleLogicalRange(timeRange)
            }

            properties.reference.current.setCrosshairPosition = (price: number, horizontalPosition: Time) => {
                chart.setCrosshairPosition(price, horizontalPosition, newSeries)
            }


        }

        // chart.

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    },
        [
            merged_properties.data,
            merged_properties.layout,
            merged_properties.grid,
            merged_properties.horzScale,
            merged_properties.priceScale
        ]
    );

    return (
        <div className='w-full' style={{ height: "100%" }} ref={chartContainerRef} />
    );
}

