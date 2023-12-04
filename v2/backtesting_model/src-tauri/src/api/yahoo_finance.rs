use super::types::MarketAsset;

const PRICE_DATA_URL: &str = "https://query1.finance.yahoo.com/v7/finance/download/{symbol}-USD?period1={period1}&period2={period2}&interval={interval}&events=history&includeAdjustedClose={includeAdjustedClose}";

pub fn get_price_history(asset: &dyn MarketAsset) {
    println!("{:#?}", asset.get_symbol())
}
