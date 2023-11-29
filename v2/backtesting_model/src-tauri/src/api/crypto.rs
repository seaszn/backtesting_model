use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct CryptoMarketInfo{
    symbol: String,
    name: String,
    source: String,
}

pub fn get_crypto_data() -> Vec<CryptoMarketInfo> {
    println!("get_crypto_data");

    

    return vec![];
}
