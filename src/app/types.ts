export interface ParentComponentProperties {
    children: React.ReactNode
}

export interface DataRequest {
    price_series: { data: { time: number, value: number }[] },
    signal_series: { data: { time: number, value: number }[] }
}
export type TimeSeries = ISeries[];

export interface ISeries {
    time: string,
    value: number
}