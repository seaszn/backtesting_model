'use client'

import { BellIcon, CurrencyDollarIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'
import { Input } from '@nextui-org/react'
import { invoke } from '@tauri-apps/api/tauri'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {

  return (
    <div className="page sm:overflow-hidden overflow-y-auto">
        <h1>Hello World</h1>
    </div>
  )
}
