use lazy_static::lazy_static;

mod yahoo_finance;
use yahoo_finance::YahooDataProvider;

lazy_static! {
    static ref YAHOO_PROVIDER: YahooDataProvider = YahooDataProvider::new();
}

pub trait DataPovider {
    fn test(&self);
}

pub fn get_data_provider(name: &str) -> Option<&impl DataPovider> {
    match name {
        "YAHOOFINANCE" => {
            return Some(&*YAHOO_PROVIDER);
        }
        &_ => {
            return None;
        }
    }
}
