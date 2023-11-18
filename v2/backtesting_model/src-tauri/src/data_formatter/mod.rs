use dateparser::parse;
use serde::{Deserialize, Serialize};

use crate::data_reader::read_csv;

#[derive(Debug, Serialize, Deserialize)]
pub struct DataSetRow {
    time: String,
    value: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SerdeDataSetRow<'a> {
    time: &'a str,
    value: f64,
}

impl SerdeDataSetRow<'_> {
    pub fn to_raw(&self) -> Result<DataSetRow, anyhow::Error> {
        match parse(self.time) {
            Ok(raw_time) => {
                return Ok(DataSetRow {
                    time: format_date_string(raw_time.to_string()),
                    value: self.value,
                });
            }
            Err(err) => {
                return Err(err);
            }
        }
    }
}

fn format_date_string(input: String) -> String {
    let formatted_date = input.split(" ").collect::<Vec<&str>>()[0];
    return formatted_date.to_string();
}

pub fn format_data_set(store_path: String) -> Result<Vec<DataSetRow>, String> {
    let rows = read_csv(store_path);
    if let Some(Ok(first_row)) = rows.get(0) {
        if first_row.len() != 2 {
            return Err(String::from("Data must have 2 columns"));
        } else {
            let mut data_result: Vec<DataSetRow> = vec![];
            for result in rows {
                let unwrapped = result.unwrap();
                if let Ok(row) = unwrapped.deserialize::<SerdeDataSetRow>(None) {
                    if let Ok(confimed_row) = row.to_raw() {
                        data_result.push(confimed_row);
                    }
                } else {
                    return Err(String::from(
                        "Failed to parse file, please check the format",
                    ));
                }
            }

            if data_result.len() > 0 {
                return Ok(data_result);
            }

            return Err(String::from("Cannot import empty data sets"));
        }
    } else {
        return Err(String::from("Cannot import empty data sets"));
    }
}
