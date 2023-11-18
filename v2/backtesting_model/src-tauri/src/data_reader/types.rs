use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DataSetInfo{
    pub name: String,
    pub url: String,
    pub provider: String,
    pub store_path: String
}

impl PartialEq for DataSetInfo {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name && self.url == other.url && self.provider == other.provider && self.store_path == other.store_path
    }
}