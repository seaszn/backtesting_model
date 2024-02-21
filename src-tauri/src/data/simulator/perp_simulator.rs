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
        position::{self, Direction},
        simulation_result::{SimulationResult, TradeResult},
    },
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

    // simulate portfolio equity
    for i in 0..data.len() {
        let data_point = &data[i];

        if i > 0 {
            let prev_price_value = data[i - 1].price();
            let prev_signal_value = data[i - 1].signal();
            let current_equity = equity.last()?.value;

            if data_point.time() >= &start {
                if prev_signal_value > &critical_value {
                    // Calculate the new equity value
                    let price_factor_change = *data_point.price() / prev_price_value;
                    let new_equity = current_equity * price_factor_change;

                    // Add the new equity value to the new time series
                    equity.push(DataPoint {
                        time: *data_point.time(),
                        value: new_equity,
                    });
                } else if let Some(postition) = current_position {
                    let price_factor_change =
                        *data_point.price() / (postition.value * postition.volume);
                    let new_equity = current_equity * -price_factor_change;

                    equity.push(DataPoint {
                        time: *data_point.time(),
                        value: new_equity,
                    });
                }
            } else {
                equity.push(DataPoint {
                    time: *data_point.time(),
                    value: current_equity,
                });
            }
        } else {
            if data_point.time() >= &start {
                let direction = match data_point.signal() >= &critical_value {
                    true => Direction::Long,
                    false => Direction::Short,
                };

                current_position = Some(Position {
                    index: 0,
                    value: STARTING_CAPITAL,
                    volume: data_point.price() / STARTING_CAPITAL,
                    time: *data_point.time(),
                    direction,
                });
            }

            equity.push(DataPoint {
                time: *data_point.time(),
                value: STARTING_CAPITAL,
            });
        }
    }

    evaluate_simulation_result(&STARTING_CAPITAL, &position, &trades, &equity)
}
