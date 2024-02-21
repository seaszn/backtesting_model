use std::ops::{Index, IndexMut};

use super::data_point::DataPoint;

#[derive(Debug, Clone, serde::Serialize)]
pub struct TimeSeries {
    data: Vec<DataPoint>,
}

#[derive(Debug, serde::Serialize)]
pub struct PerformanceRatios {
    pub sharpe: f64,
    pub sortino: f64,
    pub omega: f64,
}

impl TimeSeries {
    pub fn new(data: Vec<DataPoint>) -> Self {
        TimeSeries { data }
    }

    pub fn last(&self) -> Option<&DataPoint> {
        self.data.last()
    }

    pub fn push(&mut self, point: DataPoint) {
        self.data.push(point);
    }

    pub fn std_dev(&self) -> f64 {
        let mean = self.average();
        let risiduals_sum = (self.values().iter().map(|x| (x - mean).powf(2.0))).sum::<f64>();

        (risiduals_sum / (self.data.len() as f64)).sqrt()
    }

    pub fn rate_of_change(&self, n: usize) -> Self {
        let values = self.values();
        TimeSeries::new(
            (n..values.len())
                .map(|x| DataPoint {
                    time: self.data[x].time,
                    value: values[x] / values[x - n] - 1.0,
                })
                .collect(),
        )
    }

    pub fn max_percent_drawdown(&self) -> Option<f64> {
        if self.data.len() > 1 {
            let mut max_equity = f64::MIN;
            let mut max_drawdown = f64::MAX;

            for &value in self.data.iter() {
                if value.value > max_equity {
                    max_equity = value.value;
                }

                let drawdown = value.value / max_equity - 1f64;
                if drawdown < max_drawdown {
                    max_drawdown = drawdown;
                }
            }

            return Some(max_drawdown * -100.0);
        }

        None
    }

    pub fn risk_performance_ratios(&self) -> Option<PerformanceRatios> {
        if self.data.len() > 1 {
            let tf = Self::check_tf("").sqrt();
            let returns = self.rate_of_change(1);
            let pos_returns = returns.filter(|&x| x.value >= 0.0);
            let neg_returns = returns.filter(|&x| x.value <= 0.0);
            let returns_avg = returns.average();

            let sharpe = returns_avg / returns.std_dev() * tf;
            let sortino = returns_avg / neg_returns.std_dev() * tf;
            let omega = pos_returns.sum() / (neg_returns.sum() * -1f64);

            return Some(PerformanceRatios {
                sharpe,
                sortino,
                omega,
            });
        }

        None
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }

    pub fn take(&self, n: usize) -> TimeSeries {
        Self::new(self.data.split_at(n).0.to_vec())
    }

    pub fn take_from(&self, start: usize) -> TimeSeries {
        if self.len() <= start{
            println!("{:?} / {:?}", self.len(), start)
        }

        if start <= 1 || self.len() < 1 {
            return self.clone();
        }
        Self::new(self.data. split_at(start - 1).1.to_vec())
    }

    pub fn sum(&self) -> f64 {
        self.data.iter().map(|x| x.value).sum()
    }

    pub fn filter<P>(&self, predicate: P) -> TimeSeries
    where
        P: FnMut(&&DataPoint) -> bool,
    {
        TimeSeries::new(self.data.iter().filter(predicate).map(|x| *x).collect())
    }

    pub fn iter(&self) -> core::slice::Iter<DataPoint> {
        self.data.iter()
    }

    pub fn values(&self) -> Vec<f64> {
        self.data.iter().map(|x| x.value).collect()
    }

    pub fn average(&self) -> f64 {
        self.sum() / (self.data.len() as f64)
    }

    fn check_tf(tf: &str) -> f64 {
        let base = 365f64;
        match tf {
            "M" => base / 30f64,
            "10D" => base / 10f64,
            "9D" => base / 9f64,
            "8D" => base / 8f64,
            "W" => base / 7f64,
            "6D" => base / 6f64,
            "5D" => base / 5f64,
            "4D" => base / 4f64,
            "3D" => base / 3f64,
            "2D" => base / 2f64,
            "D" => base,
            "720" => base * 2f64,
            "480" => base * 3f64,
            "240" => base * 6f64,
            "60" => base * 24f64,
            _ => base,
        }
    }
}

impl Index<usize> for TimeSeries {
    type Output = DataPoint;

    fn index(&self, s: usize) -> &DataPoint {
        &self.data[s]
    }
}

impl IndexMut<usize> for TimeSeries {
    fn index_mut(&mut self, s: usize) -> &mut DataPoint {
        &mut self.data[s]
    }
}
