use self::{spot_simulator::spot_simulation, types::simulation_type::SimulationType};

use super::{
    csv::read_from_csv,
    types::{data_entry::DataEntry, dataset::Dataset},
};

mod spot_simulator;
mod types;

// const STARTING_CAPITAL: f64 = 1000.00f64;

pub fn from_csv(path: &str, sim_type: i32) -> Result<(), String> {
    if let Ok(mut parsed) = read_from_csv::<DataEntry>(path) {
        parsed.sort_by(|a, b| a.time().partial_cmp(&b.time()).unwrap());

        return match sim_type {
            x if x == SimulationType::Perpetual as i32 => {
                //         // perpetual_simulation(&parsed);
                //         println!("perps");
                return Ok(());
            }
            x if x == SimulationType::Spot as i32 => {
                if let Some(result) = spot_simulation(Dataset::from(parsed)) {
                    println!("{:#?}", result);
                }
                //         println!("spot");
                return Ok(());
            }
            _ => Err("invalid simulation type".to_string()),
        };
    }

    Err("failed to load data".to_string())
}
