
// source: String,
// source_name: String,

use chrono::NaiveDate;
use serde::{Serialize, Deserialize};

// #[derive(Serialize, Deserialize)]
// struct BacktestConfig{
//     marketAsset: MarketAsset,
//     timeFrame: TimeFrame,
//     startDate: NaiveDate::new,
//     endDate: Date,
//     signalType: SignalType,
//     primaryValue: FuncValue,
//     secundaryValue?: FuncValue,
//     invert_signal: bool
// }

// struct MarketAssetInfo{
//     symbol: string,
//     start_date: Date,
//     provider: string,
// }

pub trait MarketAsset {
    fn get_symbol(&self) -> String;
    fn get_source(&self) -> String;
}
