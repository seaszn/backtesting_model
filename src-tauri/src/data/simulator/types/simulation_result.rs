use crate::data::types::time_series::PerformanceRatios;

pub struct SimulationResult {
    pub profit_loss: f64,
    pub percent_profitable: f64,
    pub max_percent_drawdown: f64,
    pub max_intra_trade_drawdown: f64,
    pub performance_ratios: PerformanceRatios,
    pub profit_factor: f64,
    pub n_trades: usize,
}
