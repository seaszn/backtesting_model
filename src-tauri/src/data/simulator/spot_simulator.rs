use crate::data::{
    simulator::types::{
        position::Position,
        trade::{Trade, TradeExecution},
    },
    types::{data_point::DataPoint, dataset::Dataset, time_series::TimeSeries},
};

use super::{
    evaluator::evaluate_simulation_result,
    types::{
        position,
        simulation_result::{SimulationResult, TradeResult},
    },
};

const STARTING_CAPITAL: f64 = 1f64;

pub fn spot_simulation(data: Dataset, critical_value: f64, start: i64) -> Option<SimulationResult> {
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
            if prev_signal_value > &critical_value && data_point.time() >= &start {
                // Calculate the new equity value
                let price_factor_change = *data_point.price() / prev_price_value;
                let new_equity = current_equity * price_factor_change;

                // Add the new equity value to the new time series
                equity.push(DataPoint {
                    time: *data_point.time(),
                    value: new_equity,
                });

                // Check if the signal just flipped from short to long, if so, open a new position
                if position.is_none() {
                    position = Some({
                        Position {
                            direction: position::Direction::Long,
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
                if let Some(current_position) = position {
                    let intra_trade_equity = equity.take_from(current_position.index, i);

                    trades.push(Trade::new(
                        TradeExecution {
                            index: current_position.index,
                            time: current_position.time,
                            price: *data[current_position.index].price(),
                            value: current_position.value,
                            volume: current_position.volume,
                        },
                        TradeExecution {
                            index: i,
                            time: *data_point.time(),
                            price: *data_point.price(),
                            value: current_equity,
                            volume: current_equity / *data_point.price(),
                        },
                        intra_trade_equity,
                        position::Direction::Long,
                    ));

                    position = None;
                }
            }
        } else {
            if data[*[0i32, (i as i32) - 1i32].iter().max().unwrap() as usize].signal()
                > &critical_value
                && data_point.time() >= &start
            {
                position = Some({
                    Position {
                        direction: position::Direction::Long,
                        index: i,
                        time: *data_point.time(),
                        volume: STARTING_CAPITAL / data_point.price(),
                        value: STARTING_CAPITAL,
                    }
                });
            }

            equity.push(DataPoint {
                time: *data_point.time(),
                value: STARTING_CAPITAL,
            })
        }
    }

    evaluate_simulation_result(&STARTING_CAPITAL, &position, &trades, &equity)
}
