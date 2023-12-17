use crate::util::splitter::*;
use reqwest;
use serde::{Deserialize, Serialize};
use std::io::BufReader;

use super::MarketAssetHandle;

const TOKEN_LIST_URL: &str = "https://docs.google.com/spreadsheets/d/1VvJSuC2bcPebcprhb8BUuw0pxcW203II6znI6Memwh0/export?format=csv&id=1VvJSuC2bcPebcprhb8BUuw0pxcW203II6znI6Memwh0&gid=596979248";

#[derive(Serialize, Deserialize, Debug)]
pub struct CryptoAsset {
    symbol: String,
    start_date: i64,
    networks: Vec<String>,
    provider: String,
}

impl MarketAssetHandle for CryptoAsset {
    fn get_symbol(&self) -> String {
        return self.symbol.clone();
    }

    fn get_start_date(&self) -> i64 {
        return self.start_date.clone();
    }

    fn get_provider(&self) -> String {
        return self.provider.clone();
    }
}

pub async fn get_assets() -> Vec<CryptoAsset> {
    let mut result: Vec<CryptoAsset> = vec![];

    if let Ok(res) = reqwest::get(TOKEN_LIST_URL).await {
        if let Ok(response) = (res).text().await {
            let buffer = BufReader::new(response.as_bytes());

            for line in LineSplitter::new(buffer).skip(1) {
                if let Ok(token_string) = line {
                    let values: Vec<&str> = token_string.split(",").collect();

                    if values.len() == 4 {
                        let networks: Vec<&str> = values[3].split('/').collect();

                        result.push(CryptoAsset {
                            symbol: values[0].to_string(),
                            start_date: values[1].parse::<i64>().unwrap(),
                            provider: values[2].to_string(),
                            networks: networks.iter().map(|x| x.to_string()).collect(),
                        });
                    }
                }
            }
        }
    }

    return result;
}