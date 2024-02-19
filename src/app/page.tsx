'use client'
import { TvChart } from '@/tvChart';
import { invoke } from '@tauri-apps/api/tauri'
import { useState } from 'react';

enum SimulationType {
  Spot = 0,
  Perpetual = 1
}

export default function Home() {
  const [file, updateFile] = useState<string>()

  function onFileDialogClicked() {
    invoke<string>('open_file_dialog').then(path => {
      if (path != '') {
        updateFile(path);
      }
    })
  }

  async function onSimulateClicked() {
    if (file) {
      await invoke('run_simulation', {
        path: file,
        simType: SimulationType.Spot
      })
    }
    else {
      alert('no file selected')
    }
  }

  return (
    <div className="h-screen w-screen">
      <div className=' w-full relative pt-10 h-full'>
        <div className=' w-full h-10 fixed top-0 left-0 justify-between bg-neutral-950 p-1 border-b border-neutral-700 flex'>
          <div className='flex gap-2 my-auto'>
            <button onClick={onFileDialogClicked} className=' text-sm p-1 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors  text-white'>
              Select file
            </button>
            <p className='p-1 text-sm my-auto px-2 text-neutral-500'>
              {file || 'Please select a file...'}
            </p>
          </div>
          <div className='flex gap-2 my-auto'>
            <button onClick={onSimulateClicked} className=' text-sm p-1 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors  text-white'>
              Run simulation
            </button>
          </div>
        </div>
        <div className='h-full w-full'>
          <TvChart />
        </div>
      </div>
    </div>
  )
}
