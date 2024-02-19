use native_dialog::FileDialog;

#[tauri::command]
pub fn open_file_dialog() -> Result<String, String> {
    let response = FileDialog::new()
        .set_location("~")
        .add_filter("Dataset", &["csv"])
        .show_open_single_file();

    match response {
        Ok(path_buff) => {
            if let Some(path) = path_buff {
                return Ok(path.into_os_string().into_string().unwrap());
            }

            return Ok("".to_string());
        }
        Err(err) => Err(err.to_string()),
    }
}
