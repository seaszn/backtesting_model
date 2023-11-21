'use client'

import React, { useState, useEffect, useRef } from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ParentComponentProperties } from './types'
import { NextUIProvider, Tab } from "@nextui-org/react";
import { Suspense } from 'react';
import Nav from '@/components/_navBar'
import { Loader2, Maximize, Minimize, Minus, Plus, Square, X } from 'lucide-react'
import { TimeFrames } from './chart/types'
import { appWindow } from '@tauri-apps/api/window'
// import { DARK_THEME, useTheme } from '@/lib/hooks/useTheme/useTheme'
import { DataSetType, useDataSet } from '@/lib/hooks/useData'
import { useTheme } from '@/lib/hooks/useTheme'
import { TabHandleReference, TabMenu, TabMenuCanvas } from '@/components/tabMenu'
import { PageRenderer } from '@/components/pageRenderer'
import { WindowButtons } from '@/components/windowButtons'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout(properties: ParentComponentProperties) {
  const [pageIndex, updatePageIndex] = useState<number>(0);
  const [pages, updatePages] = useState<TabHandleReference[]>([]);
  const theme = useTheme();

  function selectedChanged(index: number) {
    // console.log(index);
    updatePageIndex(index);
  }

  function handlesChanged(handles: TabHandleReference[]) {
    console.log(handles.map(x => x.id))
    updatePages(handles);
  }

  function currentPageHandle() {
    return pages[pageIndex];
  }

  return (
    <html lang="en" className={theme.current().htmlClass + (theme.current().htmlClass == "" ? " light-scrollbar" : " dark-scrollbar")}>
      <body className={`sm:overflow-hidden dark:bg-zinc-900 ${inter.className}`}>
        <NextUIProvider>
          <div className='w-full border-b border-b-zinc-300 dark:border-b-zinc-700 h-9 bg-zinc-100 dark:bg-zinc-900'>
            <div data-tauri-drag-region className="bg-zinc-100 h-8 dark:bg-zinc-700 flex justify-between whitespace-nowrap">
              <TabMenu tabHandlesChanged={handlesChanged} selectedChanged={selectedChanged} allowAddWindow={true} />
              <WindowButtons />
            </div>
          </div>
          <main className="min-h-screen flex bg-zinc-100 dark:bg-zinc-900">
            <TabMenuCanvas className='w-full grow bg-red-400'>
              {
                currentPageHandle() ? (
                  <PageRenderer handle={currentPageHandle()} />
                ) : (
                  <></>
                )

              }
              {/* {
                <></>
              } */}
            </TabMenuCanvas>
            {/* {
              loading ? (
                <div className={'transition-all w-full min-h-screen dark:bg-stone-900 bg-stone-100'}>
                  <div className='fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 justify-center'>
                    <Loader2 className='mx-auto w-10 h-10 animate-spin text-black dark:text-white'></Loader2>
                    <h1 className='pt-2 text-black dark:text-white align-middle text-center'>Loading...</h1>
                  </div>
                </div>
              ) : (
                <div className='w-full flex min-h-screen'>
                  <Nav />
                  <div className=' grow bg-stone-200 dark:bg-stone-900'>
                    <div className='flex h-full transition-transform overflow-hidden'>
                      {properties.children}
                    </div>
                  </div>
                </div>
              )
            } */}
          </main>
        </NextUIProvider>
      </body>
    </html>
  )
}
