import { appWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

export function WindowButtons() {
    return (
        <div className='flex'>
            <button className=" titlebar-button text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => appWindow.minimize()}>
                <Minus className='pb-1.5 mt-auto h-auto  w-3' />
            </button>
            <button className="titlebar-button text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => appWindow.toggleMaximize()}>
                <Square className='w-3' />
            </button>
            <button className="titlebar-button text-black dark:text-white hover:bg-red-500" onClick={() => appWindow.close()}>
                <X className='w-4' />
            </button>
        </div>
    )
}