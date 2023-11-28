'use client'

import React, { useEffect, useRef, useState, useContext } from 'react'
import './globals.css'
import 'react-resizable/css/styles.css'
import * as ReactDOM from 'react-dom';

import { Inter } from 'next/font/google'
import { ParentComponentProperties } from './types'
import { NextUIProvider } from "@nextui-org/react";
import { useTheme } from '@/lib/hooks/useTheme'
import { TabMenu } from '@/components/tabMenu'
import { ShellButtons } from '@/components/shell'
import { useSession } from '@/lib/hooks/useSession'
import { useRouter } from 'next/navigation'
import { ModalContext, ModalProvider } from '@/lib/hooks/useModal/modalContext';

const inter = Inter({ subsets: ['latin'] })

Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

export default function RootLayout(properties: ParentComponentProperties) {
  const theme = useTheme();
  const router = useRouter();
  const session = useSession();

  function onPageHandlesChanged(handles: string[]) {
    const currentSessions = session.current();
    const filteredDashboards = currentSessions.dashboards.filter(x => handles.indexOf(x.id) != -1)

    session.update({
      ...session.current(),
      dashboards: [...filteredDashboards]
    })
  }

  function getDashboardHandles() {
    return session.current().dashboards.map(x => x.id)
  }

  function onHandleChanged(id: string) {
    router.push(`/dashboard/${id}`);
  }

  return (
    <html lang="en" className={theme.current().htmlClass + (theme.current().htmlClass == "" ? " light-scrollbar" : " dark-scrollbar")}>
      <body className={` bg-zinc-900 overflow-hidden ${inter.className}`}>
        <NextUIProvider>
          <div className='w-full overflow-hidden h-9 bg-zinc-100 '>
            <div data-tauri-drag-region className="bg-zinc-100 h-9 dark:bg-zinc-700 flex justify-between whitespace-nowrap">
              <TabMenu initialTabs={getDashboardHandles()} allowAddWindow={true} onSelectionChanged={onHandleChanged} onTabsChanged={onPageHandlesChanged} />
              <ShellButtons />
            </div>
          </div>
          <div className='bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 border-b w-full h-1'></div>
          <main className="h-screen relative overflow-hidden w-full bg-zinc-300 text-black dark:text-white dark:bg-zinc-700">
            {properties.children}
          </main>
        </NextUIProvider>
      </body>
    </html>
  )
}
