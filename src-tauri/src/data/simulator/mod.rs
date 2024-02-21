use self::{
    perp_simulator::perpertual_simulation, spot_simulator::spot_simulation, types::{simulation_result::SimulationResult, simulation_type::SimulationType}
};

use super::{
    csv::read_from_csv,
    types::{data_entry::DataEntry, dataset::Dataset},
};

mod perp_simulator;
mod evaluator;
mod spot_simulator;
pub mod types;

// const STARTING_CAPITAL: f64 = 1000.00f64;

pub fn from_csv(
    path: &str,
    sim_type: i32,
    critical_value: f64,
    start: i64,
) -> Result<SimulationResult, String> {
    if let Ok(parsed) = read_from_csv::<DataEntry>(path) {
        // parsed.sort_by(|a, b| a.time().partial_cmp(&b.time()).unwrap());

        return match sim_type {
            x if x == SimulationType::Perpetual as i32 => {
                if let Some(result) = perpertual_simulation(Dataset::from(parsed), critical_value, start) {
                    return Ok(result);
                }
                Err("failed to perform backtest".to_string())
            }
            x if x == SimulationType::Spot as i32 => {
                if let Some(result) = spot_simulation(Dataset::from(parsed), critical_value, start) {
                    return Ok(result);
                }
                Err("failed to perform backtest".to_string())
            }
            _ => Err("invalid simulation type".to_string()),
        };
    }

    Err("failed to load data".to_string())
}
