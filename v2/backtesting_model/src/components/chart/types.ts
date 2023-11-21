import { CrosshairOptions, GridOptions, HorzScaleOptions, LayoutOptions, PriceScaleOptions, Range, Time } from "lightweight-charts";

export interface ColorsProperties {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
}

export type TimeSeries = { time: string, value: number }[]

export interface ChartReference {
    setVisibleTimeRange?: (range: Range<number>) => void,
    setCrosshairPosition?: (price: number, horizontalPosition: Time) => void,
    id?: () => number,
    forceResize?: () => void
}

export interface ChartProperties {
    id: number,
    data: TimeSeries,
    layout?: LayoutOptions,
    grid?: GridOptions,
    crosshair?: CrosshairOptions,
    horzScale?: HorzScaleOptions,
    priceScale?: PriceScaleOptions,
    onVisibleRangeChanged?: (timeRange: Range<number>, id: number) => void,
    onCrosshairMoved?: (value: number, time: Time, id: number) => void,
    reference?: React.MutableRefObject<ChartReference>
}