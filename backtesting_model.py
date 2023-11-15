import lib.json as json
import lib.properties as properties
import lib.portfolio as portfolio
import tkinter as tk
import lib.exporter as exp
import statistics as st
import lib.data_formatter as data_formatter
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import (FigureCanvasTkAgg, NavigationToolbar2Tk)
import pandas as pd
import tkinter as tk

## OPENING BTC FILE
btc_file_path = "data\\Markets\\bitcoin_1d.json"
btc_data = json.get_json(btc_file_path)
timeframe = btc_data ['timeframe']

## OPENING FEAR&GREED FILE
indicator_file_path = "data\\ChainExposed\\sth_mvrv.json"
indicator_data = json.get_json(indicator_file_path)

## TRANSFORMING BTC DATA
btc_df = pd.DataFrame(btc_data['values'])
btc_df.columns = ['Date', 'BTC_Price']
btc_df['Date'] = pd.to_datetime(btc_df['Date'])
btc_df['BTC_Price'] = btc_df['BTC_Price'].astype(float)

## FIX TIMEFRAME ##

## TRANSFORMING INDICATOR DATA
x_data = indicator_data['x']
y_data = indicator_data['y']

indicator_name = indicator_data['name']
indicator_symbol = indicator_data['symbol']
indicator_y_axis_name = indicator_data['y_axis_label']
indicator_df = pd.DataFrame({
    'Date': x_data,
    'Value': y_data
})
indicator_df['Value'] = indicator_df['Value'].astype(float)
indicator_df['Date'] = pd.to_datetime(indicator_df['Date'])

## MERGING THE DATA INTO ONE DATAFRAME AND DISPLAY FIRST FEW VALUES
merged_df = pd.merge(indicator_df, btc_df, on='Date', how='inner')
merged_df.head()

## PREPARE WINDOW FOR DRAWING
root = tk.Tk()
root.wm_title(f'{indicator_name} strategy')
frame = tk.Frame(root, padx=12)
frame.pack(side='left')
figure = plt.figure(figsize=(15,7))
canvas = FigureCanvasTkAgg(figure, master=root)  # A tk.DrawingArea.
toolbar = NavigationToolbar2Tk(canvas, root, pack_toolbar=False)
toolbar.update()
toolbar.pack(side=tk.BOTTOM, fill=tk.X)
canvas.draw()
canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=True)

start_date = pd.to_datetime("2018-01-01")
initial_capital = tk.IntVar(frame, 10000)

## CALCULATE PORTFOLIO VALUES
BACKTEST_CONDITION = 1
# BACKTEST_CONDITION = st.mean(merged_df['Value'])
# BACKTEST_CONDITION = st.median(merged_df['Value'])
[
    equity,
    equity_values,
    percentage_change,
    max_trade_dd,
    profit_factor,
    pct_profitable,
    trade_count,
    equity_sharpe,
    equity_sortino,
    equity_omega
] = portfolio.track_portfolio(merged_df, BACKTEST_CONDITION, initial_capital.get())

properties.frame_statistics(frame, max_trade_dd, profit_factor, pct_profitable, trade_count, equity_sharpe, equity_sortino, equity_omega)
properties.frame_results(frame, initial_capital.get(), equity)

#### PLOTTING BACKTEST PORTFOLIO VALUE #####
equity_plot = figure.add_subplot(2, 1, 1) 
plt.plot(merged_df['Date'], 
         equity_values, 
         label="Portfolio Value", 
         color='red')
plt.title(f'Portfolio Value Using {indicator_symbol} Cross-Over Strategy (Long Above Score {BACKTEST_CONDITION}, Short below {BACKTEST_CONDITION})')
plt.xlabel("Date")
plt.ylabel("$ Amount")
plt.xticks(rotation=45)
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.tight_layout()

# Changing the y-axis tick sizes, and format the X axis
axis = plt.gca()
data_formatter.format_price_series(axis)
data_formatter.format_date_series(axis)

# formatted_dates = []
# for _, row in merged_df.iterrows():
#     formatted_dates.append(row['Date'].strftime('%m/%d/%y'))

# indicator_name = indicator_file_path.split('\\')[2].split(".json")[0]
# exp.export_data({'Date': formatted_dates, 'Value': equity_values}, f'{timeframe}//{indicator_name}')

##### PLOTTING INDICATOR #####
ratio_plot = figure.add_subplot(2, 1, 2) 
plt.plot(merged_df['Date'], 
        #  merged_df['BTC_Price'] / merged_df['Value'], 
         merged_df['Value'], 
         label='Value', 
         color='blue')
plt.title(f'{indicator_name}')
plt.xlabel("Date")
plt.ylabel(indicator_symbol)
plt.xticks(rotation=45)
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.tight_layout()
plt.legend()
ratio_axis = plt.gca()
data_formatter.format_date_series(ratio_axis)
# data_formatter.format_price_series(ratio_axis)

tk.mainloop()