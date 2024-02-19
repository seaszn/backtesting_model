'use client';

import { TvChart } from '@/components/tvChart';
import { invoke } from '@tauri-apps/api/tauri'
import { ChangeEvent, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SimulationType } from '@/hooks/useSimulator';
import { Bot, CandlestickChart, Check, File, Loader2Icon } from 'lucide-react';
import { StatisticValue } from '@/components/statisticsValue';
import { StatisticsSection } from '@/components/statisticsSection';
import { DataRequest, ISeries, SimulationResult, TimeSeries } from './types';
import { StatisticDate } from '@/components/statisticsDate';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export default function Home() {
  const [file, updateFile] = useState<string>()
  const [loading, updateLoading] = useState<boolean>(false)
  const [error, updateError] = useState<boolean>(false)
  const [crossover, updateCrossover] = useState(0);
  const [results, updateResults] = useState<SimulationResult>();
  const [criticalValue, updateCriticalValue] = useState(0.0);

  const [priceSeries, updatePriceSeries] = useState<TimeSeries>();
  const [signalSeries, updateSignalSeries] = useState<TimeSeries>();
  const [criticalSeries, updateCriticalSeries] = useState<TimeSeries>();

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
  }, [file])

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
      invoke<SimulationResult>('run_simulation', { path: file, simType: SimulationType.Spot as number, criticalValue }).then(response => {
        updateResults(response)
        updateLoading(false);

      }).catch(() => {
        updateError(true)
        updateLoading(false);
      });
    }
  }, [priceSeries, signalSeries, criticalSeries]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i)) {
      updateCrossover(Number.parseFloat(event.target.value));
      updateCriticalValue(Number.parseFloat(event.target.value))
    }
  };

  return (
    <div className="h-screen w-screen bg-neutral-950">
      <div className='flex w-full h-full'>
        {/* Chart panels */}
        <PanelGroup autoSaveId='chart-container' direction='vertical'>
          {
            priceSeries && signalSeries && getEquityCurve() ? (
              <>
                <Panel id='price-chart'>
                  <div className='h-full w-full'>
                    <TvChart defaultLog={true} showTimeScale={false} data={priceSeries} equityCurve={getEquityCurve()} />
                  </div>
                </Panel>
                <PanelResizeHandle className='h-1 transition-colors hover:bg-neutral-500 active:bg-neutral-500 bg-neutral-700' />
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
            </div>
            <div className='overflow-y-auto border-t border-neutral-700 '>
              {/* Configuration Section */}
              <div className='mt-6'>
                <h1 className=' text-md font-semibold text-neutral-300'>Configuration</h1>
                <div className='p-4 border mt-2 py-4 border-neutral-700'>
                  <div className=' w-full h-7 flex flex-row-reverse gap-2 pt-0.5 overflow-hidden overflow-ellipsis border-b border-neutral-700'>
                    <button onClick={onFileDialogClicked} className='shrink-0 transition-colors  hover:bg-neutral-700 h-6 w-6 rounded-t-sm text-neutral-400'>
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
                      <input type='number' onChange={handleChange} value={crossover} min={-1e9} max={1e9} step={0.01} className=' num-input p-0 text-right shrink bg-transparent w-24 text-xs my-auto focus:outline-none grow' />
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
                            <StatisticValue suffix='%' name='Equity Max Drawdown' value={results.max_percent_drawdown} />
                            <StatisticValue suffix='%' name='Intra Trade Max Drawdown' value={results.max_intra_trade_drawdown} />
                            <StatisticValue name='Sharpe Ratio' value={results.performance_ratios.sharpe} />
                            <StatisticValue name='Sortino Ratio' value={results.performance_ratios.sortino} />
                            <StatisticValue name='Omega Ratio' value={results.performance_ratios.omega} />
                            <StatisticValue name='Profit Factor' value={results.profit_factor} />
                            <StatisticValue suffix='%' name='% Profitable' value={results.percent_profitable} />
                            <StatisticValue suffix='%' name='Net Profit' value={results.profit_loss} />
                            <StatisticValue name='# of Trades' value={results.n_trades} />
                          </StatisticsSection>

                          {/* Statistics Section */}
                          <StatisticsSection header='Trades' defaultCollapsed={true} collapsable={true}>
                            {results.trades.map((x, index) => (
                              <StatisticsSection header={`Trade #${index + 1}`} >
                                <StatisticDate name='Open Date' value={priceSeries?.[x.open].time || 'n.a.'} />
                                <StatisticDate name='Close Date' value={priceSeries?.[x.close].time || 'n.a.'} />
                                <StatisticValue suffix='%' name='Max Drawdown' value={x.max_drawdown || 0} />
                                <StatisticValue suffix='%' name='Max Intra Drawdown' value={x.max_intra_trade_drawdown} />
                                <StatisticValue name='Sharpe Ratio' value={x.performance_ratios.sharpe} />
                                <StatisticValue name='Sortino Ratio' value={x.performance_ratios.sortino} />
                                <StatisticValue name='Omega Ratio' value={x.performance_ratios.omega} />
                                <StatisticValue suffix='%' name='% Net Profit' value={x.perc_profit_loss} />
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
