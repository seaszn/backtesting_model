use crate::data::types::time_series::{PerformanceRatios, TimeSeries};

use super::position::Direction;

#[derive(Debug)]
pub struct Trade {
    pub open: TradeExecution,
    pub close: TradeExecution,
    pub direction: Direction,
    pub equity: TimeSeries,
}

#[derive(Debug, serde::Serialize)]
pub struct TradeExecution {
    pub index: usize,
    pub time: i64,
    pub volume: f64,
    pub price: f64,
    pub value: f64,
}

impl Trade {
    pub fn new(open: TradeExecution, close: TradeExecution, equity: TimeSeries, direction: Direction) -> Self {
        Trade {
            open,
            close,
            equity,
            direction
        }
    }

    pub fn profit_loss(&self) -> f64 {
        self.close.value - self.open.value
    }

    pub fn profitable(&self) -> bool {
        self.close.value > self.open.value
    }

    pub fn max_percent_drawdown(&self) -> Option<f64> {
        let nominal_drawdown = (self.drawdown()? / 100f64) * self.open.value;
        let entry_price = self.open.value;

        Some(nominal_drawdown / entry_price * 100f64)
    }

    pub fn drawdown(&self) -> Option<f64> {
        if self.equity.len() > 0 {
            let mut max_equity = f64::MIN;
            let mut max_drawdown = f64::MAX;

            for &value in self.equity.iter() {
                if value.value > max_equity {
                    max_equity = value.value;
                }

                let drawdown = value.value / max_equity - 1f64;
                if drawdown < max_drawdown {
                    max_drawdown = drawdown;
                }
            }

            return Some(max_drawdown * -100.0);
        }

        None
    }

    pub fn performance_ratios(&self) -> Option<PerformanceRatios> {
        self.equity.risk_performance_ratios()
    }
}
