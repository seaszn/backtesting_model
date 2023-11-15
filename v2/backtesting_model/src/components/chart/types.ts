export interface ColorsProperties {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
}

export type TimeSeries = { time: string, value: number }[]