use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct IndicatorInfo{
    name: String,
    url: String,
    provider: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MarketInfo{
    name: String,
}