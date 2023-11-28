import { appWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

interface ShellButtonProps {
    BeforeShellShutdown?: () => Promise<void>
}
export function ShellButtons(properties: ShellButtonProps) {
    async function onCloseClick() {
        await properties.BeforeShellShutdown?.();
        appWindow.close()
    };

    return (
        <div className='flex'>
            <button className=" titlebar-button text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => appWindow.minimize()}>
                <Minus className=' stroke-1 w-3' />
            </button>
            <button className="titlebar-button text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => appWindow.toggleMaximize()}>
                <Square className='w-3 stroke-1' />
            </button>
            <button className="titlebar-button text-black dark:text-white hover:bg-red-500" onClick={onCloseClick}>
                <X className='w-4 stroke-1' />
            </button>
        </div>
    )
}