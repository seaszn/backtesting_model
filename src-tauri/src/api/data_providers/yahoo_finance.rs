use super::DataPovider;


#[derive(Debug, Clone)]
pub struct YahooDataProvider {}

impl YahooDataProvider {
    pub fn new() -> YahooDataProvider {
        return YahooDataProvider {};
    }
}

impl  DataPovider for YahooDataProvider {
    fn test(&self) {
        println!("toot");        
    }
}

