'use client'

import React from 'react'
import ReactDOM from 'react-dom'
import { ModalContext } from './modalContext'
import { X } from 'lucide-react';

export function Modal() {
    const { updateModal, visible, options } = React.useContext(ModalContext);

    if (visible) {
        return ReactDOM.createPortal(
            <div className="absolute z-20 top-0 left-0 h-screen w-full flex items-center justify-center">
                <div className='bg-zinc-200 flex flex-col z-30 dark:bg-zinc-800 rounded-md' style={{ minWidth: "18rem", maxWidth: "60rem", minHeight: "30rem" }}>
                    <div className='border-b border-zinc-300 dark:border-zinc-700 h-16 flex px-4 justify-between'>
                        <h1 className=' font-semibold text-lg my-auto'>
                            {options.title}
                        </h1>
                        <button hidden={!options.allowClose} className='h-6 w-6 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-200 my-auto'>
                            <X className='h-5 mx-auto w-5' onClick={() => {
                                updateModal?.();
                            }} />
                        </button>
                    </div>
                    <div className='p-2 grow flex px-4 mt-4 text-xs font-normal'>
                        {options.content}
                    </div>
                </div>
                <div onClick={() => {
                    if(options.closeOnClickOutside){
                        updateModal?.();
                    }
                }} className='w-full h-full absolute' style={{ background: (options.backdrop ? "rgb(0,0,0,0.8)" : "none") }} />
            </div>,
            document.querySelector("#modal-root")!
        )
    }
    else {
        return null
    }
}