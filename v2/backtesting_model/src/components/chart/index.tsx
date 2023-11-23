
// import { createChart, ColorType, GridOptions, LayoutOptions, Time, Range, LineStyle, CrosshairMode, CrosshairLineOptions, PriceScaleOptions, PriceScaleMode } from 'lightweight-charts';
// import React, {  useEffect, useRef, useState } from 'react';
// import { Button } from '@nextui-org/react';
// import { useTheme } from '@/lib/hooks/useTheme';
// import { ChartProperties } from './types';

// export const DEFAULT_GRID_OPTIONS: GridOptions = {
//     vertLines: {
//         color: '#44403c',
//         style: LineStyle.Solid,
//         visible: true
//     },
//     horzLines: {
//         color: '#44403c',
//         style: LineStyle.Solid,
//         visible: true
//     }
// }

// export const DEFAULT_PRICE_SCALE_OPTIONS: PriceScaleOptions = {
//     autoScale: true,
//     mode: PriceScaleMode.Normal,
//     invertScale: false,
//     alignLabels: true,
//     scaleMargins: { bottom: 0.1, top: 0.2 },
//     borderVisible: false,
//     borderColor: '',
//     entireTextOnly: false,
//     visible: true,
//     ticksVisible: false,
//     minimumWidth: 60
// }

// export const DEFAULT_HORZ_SCALE_OPTIONS = {
//     rightOffset: 0,
//     barSpacing: 6,
//     minBarSpacing: 0.5,
//     fixLeftEdge: false,
//     fixRightEdge: false,
//     lockVisibleTimeRangeOnResize: false,
//     rightBarStaysOnScroll: false,
//     borderVisible: true,
//     borderColor: "#2B2B43",
//     visible: true,
//     timeVisible: false,
//     secondsVisible: true,
//     shiftVisibleRangeOnNewBar: true,
//     allowShiftVisibleRangeOnWhitespaceReplacement: false,
//     ticksVisible: false,
//     tickMarkMaxCharacterLength: undefined,
//     minimumHeight: 0,
//     uniformDistribution: true
// }

// export const DEFAULT_CROSSHAIR_LINE_OPTIONS: CrosshairLineOptions = {
//     color: "#d6d3d1",
//     labelBackgroundColor: 'white',
//     width: 1,
//     style: LineStyle.Dashed,
//     visible: true,
//     labelVisible: true
// }

// export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
//     background: { type: ColorType.Solid, color: '#1c1917' },
//     textColor: 'white',
//     fontSize: 12,
//     fontFamily: `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`
// }

// export const DEFAULT_CHART_PROPERTIES: ChartProperties = {
//     data: [],
//     layout: DEFAULT_LAYOUT_OPTIONS,
//     grid: DEFAULT_GRID_OPTIONS,
//     crosshair: {
//         vertLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
//         horzLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
//         mode: CrosshairMode.Normal
//     },
//     priceScale: DEFAULT_PRICE_SCALE_OPTIONS,
//     horzScale: DEFAULT_HORZ_SCALE_OPTIONS
// }

// export default function ChartRenderer(properties: ChartProperties) {
//     const chartContainerRef = useRef<any>();
//     const theme = useTheme();

//     const [autoScale, setAutoScale] = useState(true);
//     const [logScale, setLogScale] = useState(false);

//     function toggleAutoScale() {
//         console.log(autoScale);
//         setAutoScale(!autoScale);
//     }

//     function toggleLogScale() {
//         setLogScale(!logScale);
//     }

//     const themeProperties: ChartProperties = {
//         ...DEFAULT_CHART_PROPERTIES,
//         grid: {
//             vertLines: {
//                 color: theme.current()!.gridColor,
//                 style: LineStyle.Solid,
//                 visible: true
//             },
//             horzLines: {
//                 color: theme.current()!.gridColor,
//                 style: LineStyle.Solid,
//                 visible: true
//             }
//         },
//         crosshair: {
//             vertLine: {
//                 ...DEFAULT_CROSSHAIR_LINE_OPTIONS,
//                 color: theme.current()!.crosshair
//             },
//             horzLine: {
//                 ...DEFAULT_CROSSHAIR_LINE_OPTIONS,
//                 color: theme.current()!.crosshair
//             },
//             mode: DEFAULT_CHART_PROPERTIES.crosshair!.mode
//         },
//         layout: {
//             ...DEFAULT_LAYOUT_OPTIONS,
//             background: { type: ColorType.Solid, color: theme.current()!.backgroundColor },
//             textColor: theme.current()!.textColor

//         }
//     }

//     const merged_properties: ChartProperties = {
//         ...themeProperties,
//         ...properties,
//         priceScale: {
//             ...DEFAULT_PRICE_SCALE_OPTIONS,
//             autoScale: autoScale,
//             mode: logScale ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal
//         }
//     }


//     useEffect(() => {
//         // resize the chart
//         const handleResize = () => {
//             if (chartContainerRef.current) {
//                 chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight)
//             }
//         };

//         // initiate the chart
//         const chart = createChart(chartContainerRef.current, {
//             layout: merged_properties.layout,
//             grid: merged_properties.grid,
//             timeScale: merged_properties.horzScale,
//             height: chartContainerRef.current.clientHeight,
//             crosshair: merged_properties.crosshair,
//             rightPriceScale: merged_properties.priceScale
//         });

//         // add the data series to the chart
//         const newSeries = chart.addAreaSeries();
//         newSeries.setData(merged_properties.data);

//         // Setup time scale update listner
//         chart.timeScale().fitContent();
//         chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange: Range<number> | null) => {
//             if (timeRange) {
//                 const adjustedTimeRange: Range<number> = {
//                     from: Math.max(-100, timeRange.from),
//                     to: Math.min(merged_properties.data.length + 100, timeRange.to)
//                 }

//                 if (adjustedTimeRange != timeRange) {
//                     const timeScale = chart.timeScale();
//                     timeScale.setVisibleLogicalRange(adjustedTimeRange)
//                 }

//                 properties.onVisibleRangeChanged?.(timeRange, properties.id);

//             }
//         })

//         // Setup crosshair update listner
//         let crosshairPosition: { value: number, time: Time } = { value: 0, time: "2018-01-01" };
//         chart.subscribeCrosshairMove((event) => {
//             const pointData: { value: number | undefined, time: Time } | undefined = event.seriesData.values().next().value;

//             if (pointData) {
//                 if (pointData.value != undefined) {
//                     crosshairPosition = { value: pointData.value, time: pointData.time };

//                     properties.onCrosshairMoved?.(pointData.value, pointData.time, properties.id);
//                 }
//             }
//             else {
//                 chart.setCrosshairPosition(crosshairPosition.value, crosshairPosition.time, newSeries)
//             }
//         });

//         // setup the reference handles
//         if (properties.reference != null) {
//             properties.reference.current.id = () => properties.id

//             properties.reference.current.setVisibleTimeRange = (timeRange) => {
//                 const timeScale = chart.timeScale();
//                 timeScale.setVisibleLogicalRange(timeRange)
//             }

//             properties.reference.current.setCrosshairPosition = (price: number, horizontalPosition: Time) => {
//                 chart.setCrosshairPosition(price, horizontalPosition, newSeries)
//             }
//         }

//         // setup the container referernce resize observer
//         const resizeObserver = new ResizeObserver(() => {
//             handleResize();
//         });
//         resizeObserver.observe(chartContainerRef.current);

//         // remove the resizeObserver and the chart on window close
//         return () => {
//             resizeObserver.disconnect();
//             chart.remove();
//         };
//     },
//         [
//             merged_properties.data,
//             merged_properties.layout,
//             merged_properties.grid,
//             merged_properties.horzScale,
//             merged_properties.priceScale
//         ]
//     );

//     function getToggleButtonStyling(toggled: boolean){
//         toggled ? "dark:bg-zinc-300 bg-zinc-700 text-white dark:text-black" : ""
//     }

//     return (
//         <div className='flex grow '>
//             <div className='relative grow' style={{ width: "auto", height: "100%" }} ref={chartContainerRef} >
//                 <div className='z-10 bottom-0 absolute right-0 flex'>
//                     <Button className={`${getToggleButtonStyling(autoScale)} p-0 min-w-1 w-5 h-5 rounded-md mb-3 mr-1 min-h-8 hover:bg-zinc-700 dark:hover:bg-zinc-300 hover:text-white dark:hover:text-black`} onClick={(e) => toggleAutoScale()}>
//                         A
//                     </Button>
//                     <Button className={`${getToggleButtonStyling(logScale)}p-0 min-w-1 w-5 h-5 rounded-md mb-3 mr-2 min-h-8 hover:bg-zinc-700 dark:hover:bg-zinc-300 hover:text-white dark:hover:text-black `} onClick={(e) => toggleLogScale()}>
//                         L
//                     </Button>
//                 </div>
//             </div>

//         </div>

//     );
// }

