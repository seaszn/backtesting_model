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

export type TradeDirection = "Long" | "Short";

interface PerformanceRatios {
    sharpe: number,
    sortino: number,
    omega: number
}

export interface SimulationResult {
    position: {
        index: number,
        direction: TradeDirection
    } | undefined,
    equity_curve: { data: { time: number, value: number }[] }
    max_intra_trade_drawdown: number,
    max_percent_drawdown: number,
    n_trades: number,
    percent_profitable: number,
    performance_ratios: PerformanceRatios | null,
    profit_factor: number,
    profit_loss: number
    trades: TradeResult[]
}

export interface TradeResult {
    close: number,
    open: number,
    direction: TradeDirection,
    perc_profit_loss: number,
    max_intra_trade_drawdown: number,
    max_drawdown: number
    performance_ratios: PerformanceRatios
}