'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import { ParentComponentProperties } from './types'
import { NextUIProvider } from "@nextui-org/react";
import { invoke } from '@tauri-apps/api/tauri'

import './globals.css'
import 'react-resizable/css/styles.css'

const inter = Inter({ subsets: ['latin'] })
// Object.defineProperty(String.prototype, 'capitalize', {
//   value: function () {
//     return this.charAt(0).toUpperCase() + this.slice(1);
//   },
//   enumerable: false
// });

export default function RootLayout(properties: ParentComponentProperties) {
  // const router = useRouter();
  // const session = useSession();


  return (
    <html lang="en" className={"dark-scrollbar"}>
      <body className={` bg-zinc-900 overflow-hidden ${inter.className}`}>
        <NextUIProvider>
          <main className="h-screen relative overflow-hidden w-full bg-zinc-300 text-black dark:text-white dark:bg-zinc-700">
            {properties.children}
          </main>
        </NextUIProvider>
      </body>
    </html>
  )
}
