use crate::data::{
    simulator::types::{
        position::Position,
        trade::{Trade, TradeExecution},
    },
    types::{data_point::DataPoint, dataset::Dataset, time_series::TimeSeries},
};

use super::{
    evaluator::evaluate_simulation_result,
    types::{position::Direction, simulation_result::SimulationResult},
};

const STARTING_CAPITAL: f64 = 1f64;

pub fn perpertual_simulation(
    data: Dataset,
    critical_value: f64,
    start: i64,
) -> Option<SimulationResult> {
    let mut equity: TimeSeries = TimeSeries::new(vec![]);
    let mut trades: Vec<Trade> = vec![];
    let mut current_position: Option<Position> = None;
    let mut previous_position: Option<Position> = None;

    // simulate portfolio equity
    for i in 0..data.len() {
        let data_point = &data[i];

        if i > 0 {
            let prev_price_value = data[i - 1].price();
            let prev_signal_value = data[i - 1].signal();
            let current_equity = equity.last()?.value;

            // Check if we are past or on the start date
            if data_point.time() >= &start {
                if data_point.time() == &start {
                    current_position = Some(Position {
                        price: *data_point.price(),
                        index: i,
                        value: STARTING_CAPITAL,
                        volume: data_point.price() / STARTING_CAPITAL,
                        time: *data_point.time(),
                        direction: match data_point.signal() > &critical_value {
                            true => Direction::Long,
                            false => Direction::Short,
                        },
                    });
                }

                // We are long
                if prev_signal_value > &critical_value {
                    // Calculate the new equity value
                    let price_factor_change = *data_point.price() / prev_price_value;
                    let new_equity = current_equity * price_factor_change;

                    // Add the new equity value to the new time series
                    equity.push(DataPoint {
                        time: *data_point.time(),
                        value: new_equity,
                    });

                    if data_point.signal() < &critical_value {
                        previous_position = current_position.clone();
                        current_position = Some(Position {
                            price: *data_point.price(),
                            index: i,
                            direction: Direction::Short,
                            value: new_equity,
                            time: *data_point.time(),
                            volume: new_equity / *data_point.price(),
                        })
                    }
                } else {
                    // We are short
                    let price_factor_change =
                        (*data_point.price() / current_position?.price) - 1f64;
                    let new_equity =
                        current_position?.value * ((price_factor_change * -1f64) + 1f64);

                    equity.push(DataPoint {
                        time: *data_point.time(),
                        value: new_equity,
                    });

                    if data_point.signal() > &critical_value {
                        previous_position = current_position.clone();
                        current_position = Some(Position {
                            price: *data_point.price(),
                            index: i,
                            direction: Direction::Long,
                            value: new_equity,
                            time: *data_point.time(),
                            volume: new_equity / *data_point.price(),
                        })
                    }
                }

                // Log trade if signal just flipped
                if let Some(position) = previous_position {
                    let intra_trade_equity = equity.take_from(position.index);

                    trades.push(Trade::new(
                        TradeExecution {
                            index: position.index,
                            time: position.time,
                            price: *data[position.index].price(),
                            value: position.value,
                            volume: position.volume,
                        },
                        TradeExecution {
                            index: i,
                            time: *data_point.time(),
                            price: *data_point.price(),
                            value: current_equity,
                            volume: current_equity / *data_point.price(),
                        },
                        intra_trade_equity,
                        position.direction,
                    ));
                    // }
                    previous_position = None;
                }
            } else {
                equity.push(DataPoint {
                    time: *data_point.time(),
                    value: current_equity,
                });
            }
        } else {
            if data_point.time() >= &start {
                current_position = Some(Position {
                    price: *data_point.price(),
                    index: i,
                    value: STARTING_CAPITAL,
                    volume: data_point.price() / STARTING_CAPITAL,
                    time: *data_point.time(),
                    direction: match data_point.signal() > &critical_value {
                        true => Direction::Long,
                        false => Direction::Short,
                    },
                });
            }

            equity.push(DataPoint {
                time: *data_point.time(),
                value: STARTING_CAPITAL,
            });
        }
    }

    evaluate_simulation_result(&STARTING_CAPITAL, &current_position, &trades, &equity)
}
