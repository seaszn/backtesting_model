use chrono::NaiveDateTime;
use serde::{Deserialize, Deserializer, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct DataEntry {
    #[serde(deserialize_with = "deserialize_time_string")]
    time: i64,
    price: f64,
    signal: f64,
}

impl DataEntry {
    pub fn time(&self) -> &i64 {
        &self.time
    }

    pub fn price(&self) -> &f64 {
        &self.price
    }

    pub fn signal(&self) -> &f64 {
        &self.signal
    }
}

fn deserialize_time_string<'de, D: Deserializer<'de>>(d: D) -> Result<i64, D::Error> {
    let deserialized: Option<String> = Deserialize::deserialize(d)?;

    match deserialized {
        Some(time_string) => Ok(NaiveDateTime::parse_from_str(
            &format!("{} 00:00:00", time_string),
            "%Y-%m-%d %H:%M:%S",
        )
        .unwrap()
        .timestamp()),
        None => return Ok(0),
    }
}
