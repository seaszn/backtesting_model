use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone, Copy, Debug)]
pub struct DataPoint {
    pub time: i64,
    pub value: f64,
}

