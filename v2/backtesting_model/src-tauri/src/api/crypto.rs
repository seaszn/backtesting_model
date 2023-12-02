use crate::util::splitter::*;
use reqwest;
use serde::{Deserialize, Serialize};
use std::io::BufReader;

#[derive(Serialize, Deserialize, Debug)]
pub struct CryptoAsset {
    symbol: String,
    start_date: String,
    networks: Vec<String>,
    source: String,
    source_name: String,
}

const TOKEN_LIST_URL: &str = "https://docs.google.com/spreadsheets/d/1VvJSuC2bcPebcprhb8BUuw0pxcW203II6znI6Memwh0/export?format=csv&id=1VvJSuC2bcPebcprhb8BUuw0pxcW203II6znI6Memwh0&gid=596979248";

pub async fn get_token_list() -> Vec<CryptoAsset> {
    let mut result: Vec<CryptoAsset> = vec![];

    if let Ok(res) = reqwest::get(TOKEN_LIST_URL).await {
        if let Ok(response) = (res).text().await {
            let buffer = BufReader::new(response.as_bytes());

            for line in LineSplitter::new(buffer).skip(1) {
                if let Ok(token_string) = line {
                    let values: Vec<&str> = token_string.split(",").collect();

                    if values.len() == 5 {
                        let networks: Vec<&str> = values[2].split('/').collect();

                        result.push(CryptoAsset {
                            symbol: values[0].to_string(),
                            start_date: values[1].to_string(),
                            networks: networks.iter().map(|x| x.to_string()).collect(),
                            source: values[3].to_string(),
                            source_name: values[4].to_string(),
                        });
                    }
                }
            }
        }
    }

    return result;
}
