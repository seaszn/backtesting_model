use crate::data::simulator::{from_csv, types::simulation_result::SimulationResult};

#[tauri::command]
pub fn run_simulation(path: &str, sim_type: i32, critical_value: f64, start: i64) -> Result<SimulationResult, String> {
    return from_csv(path, sim_type, critical_value, start);
}
