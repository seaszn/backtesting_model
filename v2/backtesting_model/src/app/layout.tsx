'use client'

import React, { useEffect, useState } from 'react'
import './globals.css'
// import '/node_modules/react-grid-layout/css/styles.css'
// /node_modules/react-resizable/css/styles.css
// import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { Inter } from 'next/font/google'
import { ParentComponentProperties } from './types'
import { NextUIProvider, Tab } from "@nextui-org/react";
import { useTheme } from '@/lib/hooks/useTheme'
import { TabMenu } from '@/components/tabMenu'
import { ShellButtons } from '@/components/shell'
import { Session, useSession } from '@/lib/hooks/useSession'
import { useRouter } from 'next/navigation'
// import { Dashboard } from './dashboard/[id]'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`sm:overflow-hidden dark:bg-zinc-900 ${inter.className}`}>
        <NextUIProvider>
          <div className='w-full border-b border-b-zinc-300 dark:border-b-zinc-700 h-9 bg-zinc-100 dark:bg-zinc-900'>
            <div data-tauri-drag-region className="bg-zinc-100 h-8 dark:bg-zinc-700 flex justify-between whitespace-nowrap">
              <TabMenu initialTabs={getDashboardHandles()} allowAddWindow={true} onSelectionChanged={onHandleChanged} onTabsChanged={onPageHandlesChanged} />
              <ShellButtons />
            </div>
          </div>
          <main className="min-h-screen w-full bg-zinc-100 text-black dark:text-white dark:bg-zinc-900">
            {properties.children}
          </main>
        </NextUIProvider>
      </body>
    </html>
  )
}
