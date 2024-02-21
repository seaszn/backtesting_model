use crate::data::types::time_series::{PerformanceRatios, TimeSeries};

use super::position::Direction;

#[derive(Debug, serde::Serialize)]
pub struct ResultPosition{
    pub index: usize,
    pub direction: Direction
}

#[derive(Debug, serde::Serialize)]
pub struct SimulationResult {
    pub position: Option<ResultPosition>,
    pub equity_curve: TimeSeries,
    pub profit_loss: f64,
    pub percent_profitable: f64,
    pub max_percent_drawdown: f64,
    pub max_intra_trade_drawdown: f64,
    pub performance_ratios: PerformanceRatios,
    pub profit_factor: f64,
    pub n_trades: usize,
    pub trades: Vec<TradeResult>
}

#[derive(Debug, serde::Serialize)]
pub struct TradeResult {
    pub open: usize,
    pub close: usize,
    pub direction: Direction,
    pub perc_profit_loss: f64,
    pub max_percent_drawdown: Option<f64>,
    pub max_intra_trade_drawdown: Option<f64>,
    pub performance_ratios: Option<PerformanceRatios>,
}
