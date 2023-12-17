use std::fmt::Debug;

use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use serde::{Deserialize, Serialize};

use crate::api::data_providers::{get_data_provider, DataPovider};

mod crypto;

#[derive(Serialize, Deserialize, Debug)]
pub struct MarketAsset {
    symbol: String,
    start_date: i64,
    provider: String,
}

impl MarketAsset {
    pub fn new(symbol: String, start_date: i64, provider: String) -> MarketAsset {
        return MarketAsset {
            symbol,
            start_date,
            provider,
        };
    }
}

pub trait MarketAssetHandle {
    fn get_symbol(&self) -> String;
    fn get_provider(&self) -> String;
    fn get_start_date(&self) -> i64;
}

impl MarketAssetHandle for MarketAsset {
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

pub fn get_market_price_history<T: MarketAssetHandle + Debug>(
    asset: T,
    time_frame: String,
    start_date: i64,
    end_date: i64,
) {

    if let Some(data_provider) =  get_data_provider(asset.get_provider().as_str()){
        data_provider.test();
        println!("{:#?}", (asset, time_frame, start_date, end_date));
    }
}

pub async fn get_assets() -> Vec<MarketAsset> {
    let crypto_assets: Vec<MarketAsset> = crypto::get_assets()
        .await
        .par_iter()
        .map(|x| MarketAsset::new(x.get_symbol(), x.get_start_date(), x.get_provider()))
        .collect();

    return crypto_assets;
}
