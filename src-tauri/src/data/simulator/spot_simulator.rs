use crate::data::{
    simulator::types::{
        position::Position,
        trade::{Trade, TradeExecution},
    },
    types::{data_point::DataPoint, dataset::Dataset, time_series::TimeSeries},
};

use super::types::simulation_result::SimulationResult;

pub fn spot_simulation(data: Dataset) -> Option<SimulationResult> {
    let mut equity: TimeSeries = TimeSeries::new(vec![]);
    let mut trades: Vec<Trade> = vec![];
    let mut position: Option<Position> = None;

    // simulate portfolio equity
    for i in 0..data.len() {
        let data_point = &data[i];

        // Check if this is the first candle in the series
        if i > 0 {
            let prev_price_value = data[i - 1].price();
            let prev_signal_value = data[i - 1].signal();
            let current_equity = equity.last().unwrap().value;

            // Check if the signal is in a bulllish state
            if prev_signal_value > &0f64 {

                // Calculate the new equity value
                let price_factor_change = *data_point.price() / prev_price_value;
                let new_equity = current_equity * price_factor_change;

                // Add the new equity value to the new time series
                equity.push(DataPoint {
                    time: *data_point.time(),
                    value: new_equity,
                });

                // Check if the signal just flipped from short to long, if so, open a new position
                if i > 1 && data[i - 2].signal() < &0f64 {
                    position = Some({
                        Position {
                            index: i,
                            time: *data_point.time(),
                            volume: current_equity / data_point.price(),
                            value: current_equity,
                        }
                    });
                }
            } else {
                // Push the previous equity value again, since we're holding all cash
                equity.push(DataPoint {
                    time: *data_point.time(),
                    value: current_equity,
                });

                // Check if the signal just flipped short from long, if so, log the trade
                if i > 1 && data[i - 2].signal() > &0f64 {
                    if let Some(current_position) = position {
                        let intra_trade_equity = equity.take_from(current_position.index, i);

                        trades.push(Trade::new(
                            TradeExecution {
                                time: current_position.time,
                                price: *data[current_position.index].price(),
                                value: current_position.value,
                                volume: current_position.volume,
                            },
                            TradeExecution {
                                time: *data_point.time(),
                                price: *data_point.price(),
                                value: current_equity,
                                volume: current_equity / *data_point.price(),
                            },
                            intra_trade_equity,
                        ));

                        position = None;
                    }
                }
            }
        } else {
            if data_point.signal() > &0.0 {
                position = Some({
                    Position {
                        index: i,
                        time: *data_point.time(),
                        volume: 1000f64 / data_point.price(),
                        value: 1000.0,
                    }
                });
            }

            equity.push(DataPoint {
                time: *data_point.time(),
                value: 1000.0,
            })
        }
    }

    // Calculate all the simulation results
    let profit_loss: f64 = trades.iter().map(|x| x.profit_loss()).sum::<f64>() / (1000f64 / 100f64);
    let max_percent_drawdown = equity.max_percent_drawdown()?;
    let max_intra_trade_drawdown = trades
        .iter()
        .max_by(|&x, &b| {
            x.max_percent_drawdown()
                .unwrap_or(0f64)
                .total_cmp(&b.max_percent_drawdown().unwrap_or(0f64))
        })?
        .max_percent_drawdown()?;
    let performance_ratios = equity.risk_performance_ratios()?;

    let n_trades = trades.len();

    let profitable_trades: Vec<&Trade> = trades.iter().filter(|&x| x.profitable()).collect();
    let non_profitable_trades: Vec<&Trade> = trades.iter().filter(|&x| !x.profitable()).collect();
    let gross_profit: f64 = profitable_trades.iter().map(|x| x.profit_loss()).sum();
    let gross_loss: f64 = non_profitable_trades
        .iter()
        .map(|x| x.profit_loss())
        .sum::<f64>()
        .abs();

    let percent_profitable = (profitable_trades.len() as f64) / (n_trades as f64) * 100f64;
    let profit_factor = gross_profit / gross_loss;

    // Return the simulation result
    Some(SimulationResult {
        profit_loss,
        max_percent_drawdown,
        max_intra_trade_drawdown,
        performance_ratios,
        percent_profitable,
        profit_factor,
        n_trades,
    })
}
