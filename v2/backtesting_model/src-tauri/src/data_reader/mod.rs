mod types;
use std::{
    fs::{self},
    io::Read,
};

use csv::{ReaderBuilder, StringRecord};

pub use self::types::*;

pub fn read_csv(path: String) -> Vec<Result<StringRecord, csv::Error>> {
    let mut reader = ReaderBuilder::new()
        .has_headers(false)
        .from_path(path)
        .unwrap();
    return reader.records().collect();
}

pub fn read_file_to_string(entry: String) -> String {
    if let Ok(mut file) = fs::File::open(entry) {
        let mut data = String::new();
        file.read_to_string(&mut data).unwrap();
        return data;
    }
    return "".to_string();
}