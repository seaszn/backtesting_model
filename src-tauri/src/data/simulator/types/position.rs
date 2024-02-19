#[derive(Clone, Copy, Debug)]
pub struct Position {
    pub index: usize,
    pub volume: f64,
    pub value: f64,
    pub time: i64,
}