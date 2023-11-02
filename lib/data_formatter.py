import matplotlib.dates as mdates
import matplotlib.ticker as mticker

## MY FUNCTION AND CLASSES
class CustomScalarFormatter(mticker.ScalarFormatter):
    def __call__(self, x, pos=None):
        # Convert number to string using comma as thousands separator
        s = "${:,.0f}".format(x)
        return s
    
def format_date_series(xAxis):
    xAxis.xaxis.set_major_locator(mdates.YearLocator())
    xAxis.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    xAxis.xaxis.set_minor_locator(mdates.MonthLocator(
        bymonth=[4, 7, 10]))  # Setting bymonthday=-1 ensures the month tick is at the end of each month
    xAxis.xaxis.set_minor_formatter(mdates.DateFormatter('%b'))
    xAxis.tick_params(which="both", axis="x", rotation=45)
    
def format_price_series(yAxis):
    yAxis.set_yscale('log')
    _formatter = mticker.ScalarFormatter()
    _formatter.set_scientific(False)
    yAxis.yaxis.set_major_formatter(formatter=CustomScalarFormatter())
