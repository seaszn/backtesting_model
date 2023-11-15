mod types;
use std::{
    fs::{self, DirEntry},
    io::Read,
    path::Path,
};

// use crate::data_scraper::{get_url_table};

pub use self::types::IndicatorInfo;
pub use self::types::MarketInfo;

const MARKET_DATA_PATH: &str = "../data/markets";
const INDICATOR_DATA_PATH: &str = "../data/indicators";

pub fn get_market_files() -> Vec<MarketInfo> {
    if !Path::new(MARKET_DATA_PATH).exists() {
        let _ = fs::create_dir(MARKET_DATA_PATH);
    }

    let mut markets: Vec<MarketInfo> = vec![];
    if let Ok(paths) = fs::read_dir(MARKET_DATA_PATH) {
        for path in paths {
            if let Ok(entry) = path {
                let raw_json = read_file_to_string(entry);

                if let Ok(result) = serde_json::from_str::<MarketInfo>(&raw_json) {
                    markets.push(result);
                }
            }
        }
    }

    return markets;
}

pub fn get_indicator_files() -> Vec<IndicatorInfo> {
    if !Path::new(INDICATOR_DATA_PATH).exists() {
        let _ = fs::create_dir(INDICATOR_DATA_PATH);
    }

    let mut indicators: Vec<IndicatorInfo> = vec![];
    if let Ok(paths) = fs::read_dir(INDICATOR_DATA_PATH) {
        for path in paths {
            if let Ok(entry) = path {
                let raw_json = read_file_to_string(entry);

                if let Ok(result) = serde_json::from_str::<IndicatorInfo>(&raw_json) {
                    indicators.push(result);
                }
            }
        }
    }

    return indicators;
}

fn read_file_to_string(entry: DirEntry) -> String {
    let mut file = fs::File::open(entry.path()).unwrap();
    let mut data = String::new();
    file.read_to_string(&mut data).unwrap();
    return data;
}
