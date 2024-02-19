use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub enum SimulationType {
    Spot,
    Perpetual,
}
