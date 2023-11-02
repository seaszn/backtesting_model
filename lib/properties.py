import tkinter as tk
from tkinter import font as tkFont 
from tkcalendar import Calendar, DateEntry

def frame_statistics(frame, max_trade_dd, profit_factor, pct_profitable, trade_count, equity_sharpe, equity_sortino, equity_omega):
    normal_text_font = tkFont.Font(size=12)
    
    stats_frame = tk.LabelFrame(frame, text="Statistics", font=normal_text_font)
    stats_frame.grid(row=0, column=0, sticky='we', pady=12)
    
    ## SORTINO RATIO
    sortino_label = tk.Label(stats_frame, text=f'Sortino Ratio: {equity_sortino:.2f}', font=normal_text_font)
    sortino_label.grid(row=1, column=0, sticky='w', padx=10)
    
    ## SHARPE RATIO
    sharpe_label = tk.Label(stats_frame, text=f'Sharpe Ratio: {equity_sharpe:.2f}', font=normal_text_font)
    sharpe_label.grid(row=2, column=0, sticky='w', padx=10)

    ## OMEGA RATIO
    omega_label = tk.Label(stats_frame, text=f'Omega Ratio: {equity_omega:.2f}', font=normal_text_font)
    omega_label.grid(row=3, column=0, sticky='w', padx=10)
    
    ## PROFIT FACTOR
    profit_factor_label = tk.Label(stats_frame, text=f'Profit factor: {profit_factor:.2f}', font=normal_text_font)
    profit_factor_label.grid(row=4, column=0, sticky='w', padx=10)
    
    ## N° OF TRADES
    profit_factor_label = tk.Label(stats_frame, text=f'N° of Trades: {trade_count:.0f}', font=normal_text_font)
    profit_factor_label.grid(row=5, column=0, sticky='w', padx=10)
    
    ## % PROFITABLE
    profit_factor_label = tk.Label(stats_frame, text=f'% Profitable: {pct_profitable:.2f}', font=normal_text_font)
    profit_factor_label.grid(row=6, column=0, sticky='w', padx=10)
    
    ## INTRA TRADE MAX DRAWDOWN
    max_trade_dd_label = tk.Label(stats_frame, text=f'Intra Trade Max DD: {max_trade_dd:.2f}%', font=normal_text_font)
    max_trade_dd_label.grid(row=7, column=0, sticky='w', padx=10)
    
def frame_results(frame, starting_capital, final_equity):
    normal_text_font = tkFont.Font(size=12)
    
    ## RESULTS FRAME
    results_frame = tk.LabelFrame(frame, text="Results", font=normal_text_font)
    results_frame.grid(row=1, column=0, pady=12, sticky='nw')
    
    ## STARTING CAPITAL
    tk.Label(results_frame, text=f'Starting Captial: ${starting_capital:,.2f}', font=normal_text_font).grid(row=0, column=0, sticky='w', padx=10)
    
    ## FINAL CAPTIAL
    start_captial = tk.Label(results_frame, text=f'Final Capital: ${final_equity:,.2f}', font=normal_text_font)
    start_captial.grid(row=1, column=0, sticky='w', padx=10)   
    
def frame_properties(frame, start_date, initial_capital, update):
    normal_text_font = tkFont.Font(size=12)
    properties_frame = tk.LabelFrame(frame, text="Settings", font=normal_text_font)
    properties_frame.grid(row=2, column=0, pady=12, sticky='we')

    start_date_label = tk.Label(properties_frame, text="Start Date: ", font=normal_text_font)    
    start_date_label.grid(row=0, column=0, sticky='w', padx=[10, 0])
    start_date_entry = DateEntry(properties_frame, font=normal_text_font,year=start_date.year, month=start_date.month, day=start_date.day, side='left')
    start_date_entry.grid(row=0, column=1, sticky='we')

    initial_capital_label = tk.Label(properties_frame, text="Initial Capital: ", font=normal_text_font)    
    initial_capital_label.grid(row=1, column=0, sticky='w', padx=[10, 0])
    initial_capital_entry = tk.Entry(properties_frame, font=normal_text_font, text=initial_capital)
    initial_capital_entry.grid(row=1, column=1, sticky='we')

    tk.Button(properties_frame, font=normal_text_font, text="Update", command=lambda: update(start_date_entry.get_date(), int(initial_capital_entry.get()))).grid(pady=[10, 0], row=2, column=0, sticky='we', columnspan=2)