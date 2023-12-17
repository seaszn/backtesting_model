// use serde_json::json;

// use crate::INDEX_FILE_NAME;
// use crate::{data_reader::DataSetInfo};
// use std::fs;
// use std::{fs::File, io::Write, path::Path};

// pub fn write_to_file(path: String, data: String) -> bool {
//     if let Ok(mut file) = File::create(path) {
//         if file.write_all(data.as_bytes()).is_ok() {
//             return true;
//         }
//     }

//     return false;
// }

// pub fn write_data_set(
//     name: String,
//     provider: String,
//     url: String,
//     target_path: String,
//     data_set_json: String,
// ) -> Result<DataSetInfo, String> {
//     let folder_path = Path::new(target_path.as_str())
//         .parent()
//         .unwrap()
//         .to_str()
//         .unwrap();
//     let mut total_indiators = load_data_info(folder_path);
//     let indicator_info: DataSetInfo = DataSetInfo {
//         name,
//         url,
//         provider,
//         store_path: target_path.clone(),
//     };

//     if write_to_file(target_path.clone(), data_set_json) {
//         if let None = total_indiators
//             .iter()
//             .find(|x| x.name == indicator_info.name)
//         {
//             total_indiators.push(indicator_info.clone());

//             if write_to_file(
//                 folder_path.to_owned() + INDEX_FILE_NAME,
//                 json!(total_indiators).to_string(),
//             ) {
//                 return Ok(indicator_info);
//             } else {
//                 _ = fs::remove_file(target_path);
//                 return Err(String::from("Failed to write the file"));
//             }
//         }
//         else {
//             return Ok(indicator_info);
//         }
//     } else {
//         return Err(String::from("Failed to write the file"));
//     }
// }
