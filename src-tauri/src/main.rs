// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod data;
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            api::io::open_file_dialog,
            api::io::open_external,
            api::io::data::get_data_from_file,
            api::simulator::run_simulation
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
