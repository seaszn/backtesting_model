use crate::data::{
    csv::read_from_csv,
    types::{data_entry::DataEntry, data_point::DataPoint, time_series::TimeSeries},
};

#[derive(Debug, Clone, serde::Serialize)]

pub struct DataRequest {
    price_series: TimeSeries,
    signal_series: TimeSeries,
}

#[tauri::command]
pub fn get_data_from_file(path: &str) -> Result<DataRequest, String> {
    if let Ok(parsed) = read_from_csv::<DataEntry>(path) {
        // parsed.sort_by(|a, b| a.time().partial_cmp(&b.time()).unwrap());

        let price_data = TimeSeries::new(
            parsed
                .iter()
                .map(|x| DataPoint {
                    time: *x.time(),
                    value: *x.price(),
                })
                .collect::<Vec<DataPoint>>(),
        );

        let signal_data = TimeSeries::new(
            parsed
                .iter()
                .map(|x| DataPoint {
                    time: *x.time(),
                    value: *x.signal(),
                })
                .collect::<Vec<DataPoint>>(),
        );

        return Ok(DataRequest {
            price_series: price_data,
            signal_series: signal_data,
        });
    }

    Err("failed to load data".to_string())
}
