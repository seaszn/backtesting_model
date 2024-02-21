#[derive(Clone, Copy, Debug, serde::Serialize)]
pub enum  Direction {
    Long = 1,
    Short = -1
}

#[derive(Clone, Copy, Debug)]
pub struct Position {
    pub index: usize,
    pub direction: Direction,
    pub volume: f64,
    pub price: f64,
    pub value: f64,
    pub time: i64,
}