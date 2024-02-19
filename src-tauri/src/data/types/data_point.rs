use serde::Deserialize;

#[derive(Deserialize, Clone, Copy, Debug)]
pub struct DataPoint {
    pub time: i64,
    pub value: f64,
}

