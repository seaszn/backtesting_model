use csv::StringRecord;
use serde::de::DeserializeOwned;
use std::error::Error;

pub fn read_from_csv<T: serde::Serialize + DeserializeOwned>(
    path: &str,
) -> Result<Vec<T>, Box<dyn Error>> {
    let mut reader = csv::Reader::from_path(path)?;
    let mut parse_result: Vec<T> = vec![];
    for record_result in reader.records() {
        parse_result.push(
            record_result?
                .iter()
                .map(|x| x.replace("$", "").replace(",", ""))
                .collect::<StringRecord>()
                .deserialize::<T>(None)?,
        );
    }

    Ok(parse_result)
}
