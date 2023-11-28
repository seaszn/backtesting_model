import { Terminal } from "lucide-react";

interface IconButtonProperties {
    icon: React.ReactNode,
    className?: string
    selected?: boolean
    disabled?: boolean
    onClick?: () => void
}
export function IconButton(properties: IconButtonProperties) {
    return (
        <button onClick={() => properties.onClick?.()} disabled={properties.disabled || false} className={` rounded-md p-1 overflow-hidden  ${properties.selected ? 'bg-blue-700 active:bg-blue-800 ' : 'enabled:hover:bg-zinc-300 enabled:active:bg-zinc-100 enabled:dark:hover:bg-zinc-700 enabled:dark:active:bg-zinc-800 disabled:opacity-30' } ${properties.className || "h-8 w-8 mb-1"}`}>
            {properties.icon}
        </button>
    )
}