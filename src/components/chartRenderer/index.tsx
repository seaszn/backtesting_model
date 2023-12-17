import { ColorType, CrosshairLineOptions, CrosshairMode, CrosshairOptions, GridOptions, HorzScaleOptions, LayoutOptions, LineStyle, PriceScaleMode, PriceScaleOptions, Range, Time, createChart } from "lightweight-charts";
import { ChartRenderProps } from "./types";
import { useState, useEffect, useRef } from "react";

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    background: { type: ColorType.Solid, color: '#18181b' },
    textColor: 'white',
    fontSize: 10,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`
}

const DEFAULT_GRID_OPTIONS: GridOptions = {
    vertLines: {
        color: '#3f3f46',
        style: LineStyle.Solid,
        visible: true
    },
    horzLines: {
        color: '#3f3f46',
        style: LineStyle.Solid,
        visible: true
    }
}

const DEFAULT_CROSSHAIR_LINE_OPTIONS: CrosshairLineOptions = {
    color: "#d6d3d1",
    labelBackgroundColor: 'white',
    width: 1,
    style: LineStyle.Dashed,
    visible: true,
    labelVisible: true
}

const DEFAULT_CROSSHAIR_OPTIONS: CrosshairOptions = {
    vertLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
    horzLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
    mode: CrosshairMode.Normal
}

const DEFAULT_HORZ_SCALE_OPTIONS = {
    rightOffset: 0,
    barSpacing: 6,
    minBarSpacing: 0.5,
    fixLeftEdge: false,
    fixRightEdge: false,
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: false,
    borderVisible: true,
    borderColor: "#2B2B43",
    visible: true,
    timeVisible: true,
    secondsVisible: true,
    shiftVisibleRangeOnNewBar: true,
    allowShiftVisibleRangeOnWhitespaceReplacement: false,
    ticksVisible: false,
    tickMarkMaxCharacterLength: undefined,
    minimumHeight: 0,
    uniformDistribution: true
}

const DEFAULT_PRICE_SCALE_OPTIONS: PriceScaleOptions = {
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
    minimumWidth: 64
}

export function ChartRenderer(properties: ChartRenderProps) {
    const [autoScale, setAutoScale] = useState(true);
    const [logScale, setLogScale] = useState(false);

    const [layoutOptitons, updateLayoutOptions] = useState<LayoutOptions>(properties?.layoutOptions || DEFAULT_LAYOUT_OPTIONS);
    const [gridOptions, updateGridOptions] = useState<GridOptions>(properties?.gridOptions || DEFAULT_GRID_OPTIONS);
    const [crosshairOptions, updateCrosshairOptions] = useState<CrosshairOptions>(properties?.crosshairOptions || DEFAULT_CROSSHAIR_OPTIONS);
    const [horzScaleOptions, updateHorzScaleOptions] = useState<HorzScaleOptions>(properties?.horzScaleOptions || DEFAULT_HORZ_SCALE_OPTIONS);
    const [priceScaleOptions, updatePriceScaleOptions] = useState<PriceScaleOptions>(properties?.priceScaleOptions || DEFAULT_PRICE_SCALE_OPTIONS);

    const chartContainerRef = useRef<any>();
    useEffect(() => {
        updatePriceScaleOptions({
            ...priceScaleOptions,
            autoScale: autoScale,
            mode: logScale ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal
        })
        
    },
        [
            autoScale,
            logScale
        ]
    )

    useEffect(() => {
        // initiate the chart
        const chart = createChart(chartContainerRef.current, {
            layout: layoutOptitons,
            grid: gridOptions,
            timeScale: horzScaleOptions,
            height: chartContainerRef.current.clientHeight,
            width: chartContainerRef.current.clientWidth,
            crosshair: crosshairOptions,
            rightPriceScale: priceScaleOptions
        });


        // add the data series to the chart
        const newSeries = chart.addLineSeries();
        newSeries.setData(properties.data);
        chart.timeScale().fitContent();


        // set up listener for crosshair move        
        chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange: Range<number> | null) => {
            if (timeRange) {
                const adjustedTimeRange: Range<number> = {
                    from: Math.max(-100, timeRange.from),
                    to: Math.min(properties.data.length + 100, timeRange.to)
                }

                if (adjustedTimeRange != timeRange) {
                    const timeScale = chart.timeScale();
                    timeScale.setVisibleLogicalRange(adjustedTimeRange)
                }

                properties.onVisibleRangeChanged?.(timeRange, properties.id);
            }
        })

        // Subscribe to the crosshair move
        chart.subscribeCrosshairMove((event) => {
            const pointData: { value: number, time: Time } | undefined = event.seriesData.values().next().value;
            if (pointData) {
                if (pointData.value != undefined) {
                    properties.onCrosshairMoved?.(pointData.value, pointData.time, properties.id);
                }
            }
        });

        // resize the chart
        function handleResize() {
            if (chartContainerRef.current) {
                chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight)
            }
        };

        // setup the container reference resize observer
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        window.addEventListener('resize', handleResize)
        resizeObserver.observe(chartContainerRef.current);

        // setup the reference handles
        if (properties.reference != null) {
            properties.reference.current.getId = () => properties.id

            properties.reference.current.setVisibleTimeRange = (timeRange) => {
                const timeScale = chart.timeScale();
                timeScale.setVisibleLogicalRange(timeRange)
            }

            properties.reference.current.setCrosshairPosition = (price: number, horizontalPosition: Time) => {
                chart.setCrosshairPosition(price, horizontalPosition, newSeries)
            }
        }

        // remove the resizeObserver and the chart on window close
        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            chart.remove();
        };
    }, [
        layoutOptitons,
        gridOptions,
        crosshairOptions,
        horzScaleOptions,
        priceScaleOptions
    ]);

    function getToggleButtonStyling(toggled: boolean) {
        return toggled ? "dark:bg-zinc-200 bg-zinc-800 text-white dark:text-black" : "bg-zinc-200 dark:bg-zinc-800 dark:text-white text-black"
    }

    return (
        <div className={`w-full relative grow  bg-zinc-100 dark:bg-zinc-900 `} ref={chartContainerRef} style={{ height: '100%' }}>
            <div className='z-10 p-0.5 bottom-0 absolute right-0 flex w-12 mr-2'>
                <button className={`${getToggleButtonStyling(autoScale)} p-0 min-w-1 w-5 h-5 rounded-md mb-0.5 mr-auto min-h-8 hover:bg-zinc-700 dark:hover:bg-zinc-300 hover:text-white dark:hover:text-black `} onClick={(e) => setAutoScale(!autoScale)}>
                    <p className=" m-auto text-xs font-semibold">A</p>
                </button>
                <button className={`${getToggleButtonStyling(logScale)} p-0 min-w-1 w-5 h-5 rounded-md mb-0.5 ml-auto min-h-8 hover:bg-zinc-700 dark:hover:bg-zinc-300 hover:text-white dark:hover:text-black `} onClick={(e) => setLogScale(!logScale)}>
                    <p className=" m-auto text-xs font-semibold">L</p>
                </button>

            </div>
        </div>
    );
}

export type { ChartRenderProps as ChartProperties }