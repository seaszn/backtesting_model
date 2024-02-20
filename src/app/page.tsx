'use client';

import { TvChart } from '@/components/tvChart';
import { invoke } from '@tauri-apps/api/tauri'
import { ChangeEvent, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SimulationType } from '@/hooks/useSimulator';
import { Bot, CandlestickChart, Check, ChevronLeft, ChevronRight, File, Github, Loader2Icon, TrendingUp } from 'lucide-react';
import { StatisticValue } from '@/components/statisticsValue';
import { StatisticsSection } from '@/components/statisticsSection';
import { DataRequest, ISeries, SimulationResult, TimeSeries } from './types';
import { StatisticDate } from '@/components/statisticsDate';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, DialogTrigger, Group, Heading, Label, OverlayArrow, Popover, Switch } from 'react-aria-components';
import { parseDate, CalendarDate } from '@internationalized/date';
import { evaluateIntraTradeDrawdown, evaluateOmega, evaluatePercentProfitable, evaluateProfitFactor, evaluateSharpe, evaluateSortino } from './evaluation';
import { useGlobalChartState } from '@/components/tvChart/useChartState';
import { SeriesMarker, Time } from 'lightweight-charts';

export default function Home() {
  const globalChartState = useGlobalChartState();

  const [file, updateFile] = useState<string>()
  const [loading, updateLoading] = useState<boolean>(false)
  const [error, updateError] = useState<boolean>(false)
  const [crossover, updateCrossover] = useState(0);
  const [startDate, updateStartDate] = useState(parseDate('2018-01-01'));
  const [results, updateResults] = useState<SimulationResult>();
  const [criticalValue, updateCriticalValue] = useState(0.0);

  const [priceSeries, updatePriceSeries] = useState<TimeSeries>();
  const [signalSeries, updateSignalSeries] = useState<TimeSeries>();
  const [criticalSeries, updateCriticalSeries] = useState<TimeSeries>();

  useEffect(() => {
    if (file) {
      invoke<DataRequest>('get_data_from_file', { path: file }).then(response => {
        updatePriceSeries(response.price_series.data.map<ISeries>(x => {
          return {
            time: new Date(x.time * 1000).toISOString().split('T')[0],
            value: x.value
          }
        }))

        updateSignalSeries(response.signal_series.data.map<ISeries>(x => {
          return {
            time: new Date(x.time * 1000).toISOString().split('T')[0],
            value: x.value
          }
        }))

        updateCriticalSeries(response.signal_series.data.map<ISeries>(x => {
          return {
            time: new Date(x.time * 1000).toISOString().split('T')[0],
            value: criticalValue
          }
        }))
      });
    }
  }, [file, startDate])

  useEffect(() => {
    if (priceSeries) {
      updateCriticalSeries(priceSeries.map<ISeries>(x => {
        return {
          time: x.time,
          value: criticalValue
        }
      }))
    }
  }, [criticalValue]);

  useEffect(() => {

    if (priceSeries && signalSeries) {
      updateLoading(true);
      updateError(false);
      invoke<SimulationResult>('run_simulation', { path: file, simType: SimulationType.Spot as number, criticalValue, start: new Date(startDate.toString()).valueOf() / 1000 }).then(response => {
        updateResults(response)
        updateLoading(false);

      }).catch(() => {
        updateError(true)
        updateLoading(false);
      });
    }
  }, [priceSeries, signalSeries, criticalSeries, startDate]);

  function getEquityCurve(): TimeSeries | undefined {
    return results?.equity_curve.data.map(x => {
      return {
        time: new Date(x.time * 1000).toISOString().split('T')[0],
        value: x.value
      }
    });
  }

  function onFileDialogClicked() {
    invoke<string>('open_file_dialog').then(path => {
      if (path != '') {
        updateFile(path);
      }
    })
  }

  function getMarkers(): SeriesMarker<Time>[] | undefined {
    if (priceSeries && results) {
      const result = results?.trades.flatMap<SeriesMarker<Time>>(x => [
        { // Open
          time: priceSeries[Math.max(0, x.open - 1)]?.time,
          position: 'belowBar',
          color: '#22c55e',
          shape: 'arrowUp',
          text: 'entry',
        },
        { // Close
          time: priceSeries[Math.min(x.close - 1, priceSeries.length - 1)].time,
          position: 'aboveBar',
          color: '#e03f5e',
          shape: 'arrowDown',
          text: 'exit',
        }
      ])

      if (results.position) {
        result.push({ // Open
          time: priceSeries[results.position].time,
          position: 'belowBar',
          color: '#22c55e',
          shape: 'arrowUp',
          text: 'entry',
        })
      }

      if (result) {
        return result;
      }
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i)) {
      updateCrossover(Number.parseFloat(event.target.value));
      updateCriticalValue(Number.parseFloat(event.target.value))
    }
  };

  function onUpdateStartDate(e: CalendarDate) {
    if (dateIsAvailable(e)) {
      updateStartDate(e);
    }
  }

  function dateIsAvailable(e: CalendarDate) {
    if (priceSeries) {
      return (e.compare(parseDate(priceSeries[0].time)) >= 0 && e.compare(parseDate(priceSeries[priceSeries.length - 1].time)) < 0)
    }

    return false
  }

  return (
    <div className="h-screen bgrose w-screen bg-neutral-950">
      <div className='flex w-full h-full'>
        {/* Chart panels */}
        <PanelGroup autoSaveId='chart-container' direction='vertical'>
          {
            priceSeries && signalSeries && getEquityCurve() ? (
              <>
                <Panel id='price-chart'>
                  <div className='h-full w-full'>
                    <TvChart markers={getMarkers()} defaultLog={true} showTimeScale={false} data={priceSeries} equityCurve={getEquityCurve()} />
                  </div>
                </Panel>
                <PanelResizeHandle className='h-1 transition-colors bggreen hover:bg-neutral-500 active:bg-neutral-500 bg-neutral-700' />
                <Panel id='signal-chart'>
                  <div className='h-full w-full'>
                    <TvChart showTimeScale={true} data={signalSeries} criticalSeries={criticalSeries} />
                  </div>
                </Panel>
              </>
            ) : (
              <div className=' my-auto flex flex-col text-center'>
                <CandlestickChart strokeWidth={1} className=' mx-auto w-40 h-40 text-neutral-500' />
                <label className=' text-xl font-semibold mx-4 mt-6 text-center text-neutral-500'> Oops..! Please select a file to run a backtest</label>
              </div>
            )
          }
        </PanelGroup>
        {/* Menu */}
        <div className=' select-none max-w-sm w-full px-6 pt-6 border-l border-neutral-700 shrink-0 '>
          <div className=' w-full h-full flex gap-4 flex-col'>
            {/* Header */}
            <div className='flex justify-between w-full'>
              <h1 className=' text-xl font-semibold text-neutral-300 '>Backtesting Model</h1>
              <div className='flex gap-2'>

                {loading ?
                  (
                    <Loader2Icon className='animate-spinner-ease-spin w-5 h-5 -translate-y-1/2 my-auto text-indigo-500' strokeWidth={2} />
                  ) :
                  (
                    error ? (
                      <ExclamationTriangleIcon className=' w-5 h-5  my-auto text-rose-500' strokeWidth={2} />
                    ) : (
                      <Check className=' w-5 h-5  my-auto text-green-500' strokeWidth={2} />
                    )
                  )
                }
                <button onClick={() => invoke('open_external', {path: "https://github.com/seaszn/backtesting_model"})} className=' my-auto'>
                  <Github className=' w-5 h-5  my-auto text-indigo-500' strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className='overflow-y-auto border-t border-neutral-700 '>
              {/* Configuration Section */}
              <div className=''>
                <div className='p-4 border py-4 border-neutral-700'>
                  <div className=' w-full h-7 flex flex-row-reverse gap-2 pt-0.5 overflow-hidden overflow-ellipsis border-b border-neutral-700'>
                    <button tabIndex={-1} onClick={onFileDialogClicked} className='shrink-0 transition-colors  hover:bg-neutral-700 h-6 w-6 rounded-t-sm text-neutral-400'>
                      <File className=' w-4 h-4 m-auto' strokeWidth={2} />
                    </button>
                    <div className=' grow h-full overflow-hidden text-neutral-300 overflow-ellipsis w-full shrink'>
                      <label className='text-xs my-auto shrink-0 mr-4 '>File:</label>
                      <label className={`text-xs my-auto shrink-0 ${file ? 'text-neutral-300' : 'text-neutral-500'}`}>{file || 'Please select a file...'}</label>
                    </div>
                  </div>
                  <div className=' w-full h-7 mt-4 flex transition-colors flex-row-reverse focus-within:border-indigo-500 gap-2 pt-0.5 overflow-hidden overflow-ellipsis border-b border-neutral-700'>
                    <div className=' grow flex h-full overflow-hidden text-neutral-300 overflow-ellipsis shrink'>
                      <label className='text-xs my-auto shrink-0 mr-4 '>Crossover Value:</label>
                      <input disabled={file == undefined} type='number' onChange={handleChange} value={crossover} min={-1e9} max={1e9} step={0.01} className=' num-input p-0 disabled:text-neutral-500 text-right shrink bg-transparent w-24 text-xs my-auto focus:outline-none grow' />
                    </div>
                  </div>
                  <div className=' w-full h-7 mt-4 flex transition-colors flex-row-reverse focus-within:border-indigo-500 gap-2 pt-0.5  border-b border-neutral-700'>
                    <div className=' grow w-full flex h-full text-neutral-300 overflow-ellipsis shrink'>
                      <label className='text-xs my-auto shrink-0 mr-4 '>Starting date:</label>
                      <DialogTrigger>
                        <Button isDisabled={file == undefined} className='text-xs disabled:opacity-50 focus:outline-none text-right grow' excludeFromTabOrder>{startDate.toString()}</Button>
                        <Popover >
                          <Dialog className=' outline-none p-4  bg-neutral-950/50 transition-colors  disabled:text-neutral-500 text-neutral-300 backdrop-blur-sm border-neutral-700 border max-auto'>
                            {priceSeries && (
                              <div className="flex-col w-full flex justify-between ">
                                <Calendar onChange={onUpdateStartDate} minValue={parseDate(priceSeries[0].time)} maxValue={parseDate(priceSeries[priceSeries.length - 1].time)} value={startDate} className='m-auto' aria-label="start-date">
                                  <header className='mx-auto flex justify-between'>
                                    <Button slot="previous" className='focus-within:outline-none p-0.5 my-auto flex rounded-full hover:bg-neutral-700 active:bg-neutral-800 transition-colors'>
                                      <ChevronLeft strokeWidth={2} className='m-auto h-4 w-4' />
                                    </Button>
                                    <Heading className=' disabled:text-neutral-500 my-auto text-sm font-semibold' />
                                    <Button slot="next" className='focus-within:outline-none p-0.5 my-auto flex rounded-full hover:bg-neutral-700 active:bg-neutral-800 transition-colors'>
                                      <ChevronRight strokeWidth={2} className='m-auto h-4 w-4' />
                                    </Button>
                                  </header>
                                  <CalendarGrid className=' mt-4 text-xs font-medium text-neutral-700' >
                                    {(date) => <CalendarCell className={`${date.toString() != startDate.toString() ? !dateIsAvailable(date) ? ' text-neutral-700 cursor-default' : 'hover:bg-neutral-700 active:bg-neutral-800 ' : ' bg-indigo-500 hover:bg-indigo-700'} transition-colors text-neutral-300 py-1 focus:outline-none h-6 w-6 text-center align-middle rounded-sm`} date={date} />}
                                  </CalendarGrid>
                                </Calendar>
                              </div>
                            )}
                          </Dialog>
                        </Popover>
                      </DialogTrigger>
                    </div>
                  </div>
                </div>
              </div>
              <div className=''>
                <div className='h-auto relative w-full overflow-hidden'>
                  <div className={`h-full w-full absolute bg-neutral-950 transition-opacity z-40 flex ${results ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className={`text-center mx-auto flex flex-col p-4 w-56 h-56 mt-24`}>
                      {
                        file == undefined && (
                          <>
                            <Bot className='grow w-20 h-20  m-auto text-neutral-500' strokeWidth={1} />
                            <p className='text-lg text-neutral-500'>Please select a file to get started.</p>
                          </>
                        )
                      }
                    </div>
                  </div>
                  <div>
                    {
                      results && (
                        <>
                          {/* Statistics Section */}
                          <StatisticsSection header='Statistics' collapsable={true}>
                            <StatisticValue evaluate={evaluateIntraTradeDrawdown} suffix='%' name='Intra Trade Max Drawdown' value={results.max_intra_trade_drawdown} />
                            <StatisticValue evaluate={evaluateSharpe} name='Sharpe Ratio' value={results.performance_ratios.sharpe} />
                            <StatisticValue evaluate={evaluateSortino} name='Sortino Ratio' value={results.performance_ratios.sortino} />
                            <StatisticValue evaluate={evaluateOmega} name='Omega Ratio' value={results.performance_ratios.omega} />
                            <StatisticValue evaluate={evaluateProfitFactor} name='Profit Factor' value={results.profit_factor} />
                            <StatisticValue evaluate={evaluatePercentProfitable} suffix='%' name='% Profitable' value={results.percent_profitable} />
                            <StatisticValue suffix='%' name='Equity Max Drawdown' value={results.max_percent_drawdown} />
                            <StatisticValue suffix='%' name='Net Profit' value={results.profit_loss} />
                            <StatisticValue name='# of Trades' value={results.n_trades} />
                          </StatisticsSection>

                          {/* Statistics Section */}
                          <StatisticsSection header='Trades' defaultCollapsed={true} collapsable={true}>
                            {results.trades.map((x, index) => (
                              <StatisticsSection key={index} header={`Trade #${index + 1}`} >
                                <StatisticDate name='Open Date' value={priceSeries?.[x.open]?.time || 'n.a.'} />
                                <StatisticDate name='Close Date' value={priceSeries?.[x.close]?.time || 'n.a.'} />
                                <StatisticValue suffix='%' name='Max Drawdown' value={x.max_drawdown || 0} />
                                <StatisticValue suffix='%' name='Max Intra Drawdown' value={x.max_intra_trade_drawdown} />
                                <StatisticValue name='Sharpe Ratio' value={x.performance_ratios.sharpe} />
                                <StatisticValue name='Sortino Ratio' value={x.performance_ratios.sortino} />
                                <StatisticValue name='Omega Ratio' value={x.performance_ratios.omega} />
                                <StatisticValue suffix='%' name='% Net Profit' value={x.perc_profit_loss} />
                                <button onClick={() => {
                                  priceSeries && globalChartState.updateVisibleRange({
                                    from: priceSeries[Math.max(0, x.open - 10)].time,
                                    to: priceSeries[Math.min(priceSeries.length - 1, x.close + 10)].time,
                                  })
                                }} className=' mt-4 w-full h-8 text-xs border hover:bg-indigo-500 hover:text-neutral-300 transition-colors active:text-neutral-300 active:bg-indigo-600 active:border-indigo-600 border-indigo-500 text-indigo-500 font-semibold'>
                                  Focus
                                </button>
                              </StatisticsSection>
                            ))}
                          </StatisticsSection>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
