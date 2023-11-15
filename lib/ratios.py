from math import sqrt
from typing import Iterable
import statistics as st

def get_ratios(data: Iterable[float]):
    returns = []
    neg_returns = []
    pos_returns = []
    for i in range(1, len(data)):
        curr_rtrn = (data[i] / data[i - 1]) - 1
        returns.append(curr_rtrn)
        if curr_rtrn < 0:
            neg_returns.append(curr_rtrn)
        else: 
            pos_returns.append(curr_rtrn)
    returns_len = len(returns)
    avg_return = (sum(returns) / returns_len)

    sharpe = avg_return / st.stdev(returns) * sqrt(returns_len)
    sortino = avg_return / st.stdev(neg_returns) * sqrt(returns_len)
    omega = sum(pos_returns) / sum(neg_returns) * (-1)
    return[sharpe, sortino, omega]