// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use data_reader::*;
mod data_reader;
mod data_scraper;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            on_load_market_data,
            on_load_indicator_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn on_load_market_data() -> Vec<MarketInfo> {
    return get_market_files();
}

#[tauri::command]
fn on_load_indicator_data() -> Vec<IndicatorInfo> {
    return get_indicator_files();
}
