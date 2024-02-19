'use client'
import { TvChart } from '@/components/tvChart';
import { invoke } from '@tauri-apps/api/tauri'
import { ChangeEvent, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSimulator } from '@/hooks/useSimulator';
import { Bird, CandlestickChart, File, Ghost } from 'lucide-react';
import { StatisticValue } from '@/components/statisticsView';


export default function Home() {
  const simulator = useSimulator();

  const [file, updateFile] = useState<string>()
  const [crossover, updateCrossover] = useState(0);
  const [results, updateResults] = useState<any>(10);

  function onFileDialogClicked() {
    invoke<string>('open_file_dialog').then(path => {
      if (path != '') {
        updateFile(path);
      }
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      updateCrossover(Number.parseFloat(event.target.value));
    }
  };

  return (
    <div className="h-screen w-screen bg-neutral-950">
      <div className='flex w-full h-full'>
        <PanelGroup autoSaveId='chart-container' direction='vertical'>
          <Panel id='price-chart'>
            <div className='h-full w-full'>
              <TvChart />
            </div>
          </Panel>
          <PanelResizeHandle className='h-1 transition-colors hover:bg-neutral-500 active:bg-neutral-500 bg-neutral-700' />
          <Panel id='signal-chart'>
            <div className='h-full w-full'>
              <TvChart />
            </div>
          </Panel>
        </PanelGroup>
        <div className=' max-w-sm w-full px-6 pt-6 border-l overflow-y-auto border-neutral-700 shrink-0 '>
          <div className=' w-full h-full flex gap-4 flex-col'>
            <h1 className=' text-xl font-semibold text-neutral-300'>Backtesting Model</h1>
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
                    <input type='number' onChange={handleChange} value={crossover} min={Number.MIN_VALUE} max={Number.MAX_VALUE} step={0.01} className=' num-input p-0 text-right shrink bg-transparent w-24 text-xs my-auto focus:outline-none grow' />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-6 pb-6'>
              <h1 className=' text-md font-semibold text-neutral-300'>Statistics</h1>
              <div className='p-4 border mt-2 py-4 border-neutral-700'>
                {
                  results ? (
                    <div>
                      <StatisticValue name='Equity Max Drawdown' value={0.0} />
                      <StatisticValue name='Intra Trade Max Drawdown' value={0.0} />
                      <StatisticValue name='Sharpe Ratio' value={0.0} />
                      <StatisticValue name='Sortino Ratio' value={0.0} />
                      <StatisticValue name='Omega Ratio' value={0.0} />
                      <StatisticValue name='Profit Factor' value={0.0} />
                      <StatisticValue name='% Profitable' value={0.0} />
                      <StatisticValue name='% Net Profit' value={0.0} />
                      <StatisticValue name='# of Trades' value={0.0} />
                    </div>
                  ) : (
                    <div className=' my-12 flex flex-col text-center'>
                      <CandlestickChart strokeWidth={1} className=' mx-auto w-40 h-40 text-neutral-500' />
                      <label className=' text-sm mx-4 mt-6 text-center text-neutral-300'> Oops..! Please select a file to run a backtest</label>
                    </div>
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
