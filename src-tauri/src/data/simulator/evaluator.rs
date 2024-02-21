use crate::data::types::time_series::TimeSeries;

use super::types::{position::Position, simulation_result::{SimulationResult, TradeResult}, trade::Trade};

fn eval_profit_loss(trades: &Vec<Trade>, starting_capital: &f64) -> f64 {
    trades.iter().map(|x| x.profit_loss()).sum::<f64>() / (starting_capital / 100f64)
}

fn eval_max_intra_trade_drawdown(trades: &Vec<Trade>) -> Option<f64> {
    Some(
        trades
            .iter()
            .max_by(|&x, &b| {
                x.max_percent_drawdown()
                    .unwrap_or(0f64)
                    .total_cmp(&b.max_percent_drawdown().unwrap_or(0f64))
            })?
            .max_percent_drawdown()?,
    )
}

fn eval_percent_profitable(trades: &Vec<Trade>) -> f64 {
    let profitable_trades: Vec<&Trade> = trades.iter().filter(|&x| x.profitable()).collect();
    (profitable_trades.len() as f64) / (trades.len() as f64) * 100f64
}

fn eval_profit_factor(trades: &Vec<Trade>) -> f64 {
    let profitable_trades: Vec<&Trade> = trades.iter().filter(|&x| x.profitable()).collect();
    let non_profitable_trades: Vec<&Trade> = trades.iter().filter(|&x| !x.profitable()).collect();
    let gross_profit: f64 = profitable_trades.iter().map(|x| x.profit_loss()).sum();
    let gross_loss: f64 = non_profitable_trades
        .iter()
        .map(|x| x.profit_loss())
        .sum::<f64>()
        .abs();

    gross_profit / gross_loss
}

fn eval_trade_results(trades: &Vec<Trade>) -> Vec<TradeResult> {
    trades
        .iter()
        .map(|x| TradeResult {
            direction: x.direction,
            open: x.open.index,
            close: x.close.index,
            perc_profit_loss: ((x.close.value / x.open.value) - 1f64) * 100f64,
            max_percent_drawdown: x.drawdown(),
            max_intra_trade_drawdown: x.max_percent_drawdown(),
            performance_ratios: x.performance_ratios(),
        })
        .collect()
}

pub fn evaluate_simulation_result(starting_capital: &f64, position: &Option<Position>, trades: &Vec<Trade>, equity: &TimeSeries) -> Option<SimulationResult>{
    // Calculate all the simulation results
    let profit_loss = eval_profit_loss(trades, starting_capital);
    let max_percent_drawdown = equity.max_percent_drawdown()?;
    let max_intra_trade_drawdown = eval_max_intra_trade_drawdown(trades)?;
    let performance_ratios = equity.risk_performance_ratios()?;
    let n_trades = trades.len();
    let percent_profitable = eval_percent_profitable(trades);
    let profit_factor = eval_profit_factor(trades);
    let trade_results: Vec<TradeResult> = eval_trade_results(trades);

    if let Some(position) = position {
        // Return the simulation result
        return Some(SimulationResult {
            position: Some(position.index),
            equity_curve: equity.clone(),
            profit_loss,
            max_percent_drawdown,
            max_intra_trade_drawdown,
            performance_ratios,
            percent_profitable,
            profit_factor,
            n_trades,
            trades: trade_results,
        });
    }

    Some(SimulationResult {
        position: None,
        equity_curve: equity.clone(),
        profit_loss,
        max_percent_drawdown,
        max_intra_trade_drawdown,
        performance_ratios,
        percent_profitable,
        profit_factor,
        n_trades,
        trades: trade_results,
    })
}
