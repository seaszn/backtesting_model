'use client'

import React, { useState, useEffect } from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ParentComponentProperties } from './types'
import { NextUIProvider } from "@nextui-org/react";
import { Suspense } from 'react';
import Nav from '@/components/navBar/navbar'
import { useIndicators } from '@/lib/hooks/useIndicatorData'
import { useMarkets } from '@/lib/hooks/useMarketData'
import { Loader2 } from 'lucide-react'
import { TimeFrames } from './chart/types'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout(properties: ParentComponentProperties) {
  const [loading, setLoading] = useState(true);
  const indicators = useIndicators();
  const markets = useMarkets();

  useEffect(() => {
    const indicatorSetup = indicators.refresh().then(result => {
      indicators.select(result[0])
    });

    const marketSetup = markets.refresh().then(result => {
      markets.select(result[0])
    });

    const timeFrameSetup = new Promise<void>(resolve => {
      localStorage.setItem("selected_time_frame", TimeFrames[0].toString())
      resolve();
    })

    Promise.all([indicatorSetup, marketSetup, timeFrameSetup]).then(x => {
      setLoading(false)
    })

  }, []);

  return (
    <html lang="en" className='dark'>
      <body className={`sm:overflow-hidden overflow-y-auto ${inter.className}`}>
        <NextUIProvider>
          <main className="min-h-screen">
            {
              loading ? (
                <div className={'transition-all w-full min-h-screen dark:bg-stone-900 bg-stone-100'}>
                  <div className='fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 justify-center'>
                    <Loader2 className='mx-auto w-10 h-10 animate-spin text-black dark:text-white'></Loader2>
                    <h1 className='pt-2 text-black dark:text-white align-middle text-center'>Loading...</h1>
                  </div>
                </div>
              ) : (
                <div className='w-full min-h-screen'>
                  <Nav>
                    <Suspense fallback={<div>Loading...</div>}>
                    </Suspense>
                  </Nav>
                  <div className='w-full min-h-screen sm:pl-60 bg-stone-200 dark:bg-stone-900'>
                    <div className='w-full h-full transition-transform'>
                      {properties.children}
                    </div>
                  </div>
                </div>
              )
            }
          </main>
        </NextUIProvider>
      </body>
    </html>
  )
}
