use crate::data::simulator::from_csv;

#[tauri::command]
pub fn run_simulation(path: &str, sim_type: i32) -> Result<(), String> {
    return from_csv(path, sim_type);
}
