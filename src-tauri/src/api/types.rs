
use serde::{Serialize, Deserialize};

use super::market::MarketAsset;

#[derive(Serialize, Deserialize, Debug)]
pub struct BacktestConfig {
    market_asset: MarketAsset,
    time_frame: String,
    start_date: i64,
    end_date: i64,
    signal_type: String,
    primary_value: String,
    secundary_value: Option<String>,
    invert_signal: bool,
}
