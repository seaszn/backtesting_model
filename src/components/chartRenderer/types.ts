import { CrosshairOptions, GridOptions, HorzScaleOptions, LayoutOptions, PriceScaleOptions, Range, Time } from "lightweight-charts";
export type TimeSeries = { time: string, value: number }[]

export interface ChartRenderProps {
    id: string,
    data: TimeSeries,
    className?: string,
    layoutOptions?: LayoutOptions,
    gridOptions?: GridOptions,
    crosshairOptions?: CrosshairOptions,
    horzScaleOptions?: HorzScaleOptions,
    priceScaleOptions?: PriceScaleOptions,
    onVisibleRangeChanged?: (timeRange: Range<number>, id: string) => void,
    onCrosshairMoved?: (value: number, time: Time, id: string) => void,
    reference?: React.MutableRefObject<ChartReference>
}

export interface ChartReference {
    setVisibleTimeRange?: (range: Range<number>) => void,
    setCrosshairPosition?: (price: number, horizontalPosition: Time) => void,
    getId: () => string
}