use super::data_entry::DataEntry;
use std::ops::{Index, IndexMut};

#[derive(Debug)]
pub struct Dataset {
    data: Vec<DataEntry>,
}

impl Dataset {
    pub fn from(data: Vec<DataEntry>) -> Dataset {
        Dataset { data }
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }

    // pub fn last(&self) -> Option<&DataEntry> {
    //     self.data.last()
    // }

    // pub fn _take(&self, start: usize, end: usize) -> Self {
    //     if start > end {
    //         panic!("start cannot be greater than end")
    //     } else if end > self.data.len() - 1 {
    //         panic!("end cannot ge greater than the length - 1")
    //     }

    //     Self::from(self.data.clone())
    // }
}

impl Index<usize> for Dataset {
    type Output = DataEntry;

    fn index(&self, s: usize) -> &DataEntry {
        &self.data[s]
    }
}

impl IndexMut<usize> for Dataset {
    fn index_mut(&mut self, s: usize) -> &mut DataEntry {
        &mut self.data[s]
    }
}
