'use client';

import { TvChart } from '@/components/tvChart';
import { invoke } from '@tauri-apps/api/tauri'
import { ChangeEvent, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSimulator } from '@/hooks/useSimulator';
import { CandlestickChart, File } from 'lucide-react';
import { Evaluation, StatisticValue } from '@/components/statisticsValue';
import { StatisticsSection } from '@/components/statisticsSection';
import { DataRequest, ISeries, TimeSeries } from './types';
import { Range, Time } from 'lightweight-charts';



export default function Home() {
  const simulator = useSimulator();
  const [visibleRange, updateVisibleRange] = useState<Range<Time>>()
    
  const [file, updateFile] = useState<string>()
  const [crossover, updateCrossover] = useState(0);
  const [results, updateResults] = useState<any>();
  const [criticalValue, updateCriticalValue] = useState(0.0);

  const [priceSeries, updatePriceSeries] = useState<TimeSeries>();
  const [signalSeries, updateSignalSeries] = useState<TimeSeries>();
  const [criticalSeries, updateCriticalSeries] = useState<TimeSeries>();

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

  useEffect(runSimulation, [priceSeries, signalSeries, criticalSeries])

  function runSimulation() {
    if (priceSeries && signalSeries && criticalSeries) {

    }
  }

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
            priceSeries && signalSeries ? (
              <>
                <Panel id='price-chart'>
                  <div className='h-full w-full'>
                    <TvChart defaultLog={true} showTimeScale={false} data={priceSeries} />
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
            <h1 className=' text-xl font-semibold text-neutral-300 '>Backtesting Model</h1>
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
                      <input type='number' onChange={handleChange} value={crossover} min={-1e9} max={Number.MAX_VALUE} step={0.01} className=' num-input p-0 text-right shrink bg-transparent w-24 text-xs my-auto focus:outline-none grow' />
                    </div>
                  </div>
                  <button className=" mt-4 border text-indigo-500 text-xs border-indigo-500 font-semibold hover:bg-indigo-500 hover:text-neutral-300 transition-colors active:bg-indigo-700 active:border-indigo-700 p-1 w-full">
                    Simulate
                  </button>
                </div>
              </div>
              <div className='pb-6'>
                {
                  results && (
                    <>
                      {/* Statistics Section */}
                      <StatisticsSection header='Statistics' collapsable={true}>
                        <StatisticValue evaluate={() => Evaluation.Good} name='Equity Max Drawdown' value={0.0} />
                        <StatisticValue evaluate={() => Evaluation.Bad} name='Intra Trade Max Drawdown' value={0.0} />
                        <StatisticValue evaluate={() => Evaluation.Medium} name='Sharpe Ratio' value={0.0} />
                        <StatisticValue name='Sortino Ratio' value={0.0} />
                        <StatisticValue name='Omega Ratio' value={0.0} />
                        <StatisticValue name='Profit Factor' value={0.0} />
                        <StatisticValue name='% Profitable' value={0.0} />
                        <StatisticValue name='% Net Profit' value={0.0} />
                        <StatisticValue name='# of Trades' value={0.0} />
                      </StatisticsSection>

                      {/* Statistics Section */}
                      <StatisticsSection header='Trades' defaultCollapsed={true} collapsable={true}>
                        <StatisticsSection header='Trade #1' >
                          <StatisticValue name='Max Drawdown' value={0.0} />
                          <StatisticValue name='Sharpe Ratio' value={0.0} />
                          <StatisticValue name='Sortino Ratio' value={0.0} />
                          <StatisticValue name='Omega Ratio' value={0.0} />
                          <StatisticValue name='% Net Profit' value={0.0} />
                        </StatisticsSection>
                        <StatisticsSection onFocus={() => { }} header='Trade #2'>
                          <StatisticValue name='Max Drawdown' value={0.0} />
                          <StatisticValue name='Sharpe Ratio' value={0.0} />
                          <StatisticValue name='Sortino Ratio' value={0.0} />
                          <StatisticValue name='Omega Ratio' value={0.0} />
                          <StatisticValue name='% Net Profit' value={0.0} />
                        </StatisticsSection>
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
  )
}
