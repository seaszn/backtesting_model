// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use data_reader::*;
// use data_writer::write_data_set;
// use serde_json::json;

// use data_formatter::*;
// use session_storage::*;
// mod data_formatter;
// mod data_reader;
mod api;
mod util;
// mod data_writer;
// mod session_storage;

use api::crypto::*;
// const INDEX_FILE_NAME: &str = "/_index.json";

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_crypto_assets
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_crypto_assets() -> Vec<CryptoAsset> {
    return api::crypto::get_assets().await;
}
// #[tauri::command]
// fn load_data_info(folder: &str) -> Vec<DataSetInfo> {
//     let raw_json = read_file_to_string(format!("{}/", folder) + INDEX_FILE_NAME);

//     if let Ok(result) = serde_json::from_str::<Vec<DataSetInfo>>(&raw_json) {
//         return result;
//     } else {
//         return vec![];
//     }
// }

// #[tauri::command(rename_all = "snake_case")]
// fn import_data_set(
//     name: String,
//     provider: String,
//     url: String,
//     store_path: String,
//     target_path: String,
// ) -> Result<DataSetInfo, String> {
//     if let Ok(data_set_rows) = format_data_set(store_path) {
//         return write_data_set(
//             name,
//             provider,
//             url,
//             target_path,
//             json!(data_set_rows).to_string(),
//         );
//     } else {
//         return Err(String::from("Failed to format the file"));
//     }
// }
