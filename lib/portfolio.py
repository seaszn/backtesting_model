import lib.ratios as ratios
import sys
import statistics as st

def track_portfolio(merged_df, condition, initial_capital):
    equity_curve = []
    trades = []
    capital = initial_capital
    
    current_position_is_long = False
    in_position = False
    trade_open_price = 0
    trade_open_date = ""
    trade_volume = 0
    
    # Traverse through the merged data
    for i, row in merged_df.iterrows():
        # stdev = st.stdev(merged_df['Value']) 
        # mean = st.mean(merged_df['Value']) 
        indicator_value = row['Value']
        date =  row['Date'].strftime('%Y-%m-%d')
        if i > 0:
            btc_price = merged_df['BTC_Price'][i]

            if indicator_value > condition:
                if not current_position_is_long or not in_position:
                    if in_position:
                        trades.append(get_trade_result(trade_open_price, btc_price,  trade_open_date, date, current_position_is_long))
                        
                    trade_volume = capital / btc_price
                    current_position_is_long = True
                    in_position = True
                    trade_open_date = date
                    trade_open_price = btc_price

                capital = trade_volume * btc_price
            else:
                if current_position_is_long or not in_position:
                    if in_position:
                        trades.append(get_trade_result(trade_open_price, btc_price,  trade_open_date, date, current_position_is_long))

                    current_position_is_long = False
                    in_position = True
                    trade_open_date = date
                    trade_open_price = btc_price
                
                trade_return = ((btc_price / trade_open_price) - 1) * -1
                trade_open_value = trade_open_price * trade_volume
                gross_profit_loss = trade_open_value * trade_return 
                capital = trade_open_value + gross_profit_loss
        
        equity_curve.append(capital)
    
    equity = equity_curve[-1]
    percentage_change = ((equity - initial_capital) / initial_capital) * 100
    trade_count = len(trades)
    max_trade_dd = get_max_dd(trades)
    [profit_factor, pct_profitable] = get_profit_factor(trades)
    [equity_sharpe, equity_sortino, equity_omega] = ratios.get_ratios(equity_curve)
    
    return [equity, equity_curve, percentage_change, max_trade_dd, profit_factor, pct_profitable, trade_count, equity_sharpe, equity_sortino, equity_omega]
    
def get_trade_result(open_price, close_price, open_date, close_date, long):
    if long:
        trade_return_pct = (close_price / open_price - 1) * 100
        return {
            "open_date": open_date,
            "close_date": close_date,
            "open_price": open_price,
            "close_price": close_price,
            "profit_loss": trade_return_pct,
            "long": long
        }
    else:
        trade_return_pct = ((close_price / open_price - 1) * 100) * -1
        return {
            "open_date": open_date,
            "close_date": close_date,
            "open_price": open_price,
            "close_price": close_price,
            "profit_loss": trade_return_pct,
            "long": long
        }

def get_max_dd(trades):
    max_dd = sys.float_info.max
    for  trade in trades:
        if trade["profit_loss"] < max_dd:
            max_dd = trade["profit_loss"]
    return max_dd
        
def get_profit_factor(trades):
    pos_returns = 0
    neg_returns = 0
    pos_trades = 0
    neg_trades = 0
    
    for  trade in trades:
        trade_return = trade["profit_loss"] 
        if trade_return > 0:
            pos_returns = pos_returns + trade_return
            pos_trades = pos_trades +1
        else:
            neg_returns = neg_returns + trade_return
            neg_trades = neg_trades +1
    
    return [pos_returns / (neg_returns * -1), (pos_trades / (pos_trades + neg_trades) * 100)]

