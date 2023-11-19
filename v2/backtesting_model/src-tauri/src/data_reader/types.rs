use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DataSetInfo {
    pub name: String,
    pub url: String,
    pub provider: String,
    pub store_path: String,
}

impl PartialEq for DataSetInfo {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
    }
}
