import { X } from "lucide-react"
import { Link } from "@nextui-org/react"

export interface ToolbarTabProps {
    allowClose: boolean,
    index: number,
    selectedIndex: number,
    id: string
    hoverIndex: number | undefined
    onSelect: (id: string) => void
    onClose: (id: string) => void
    onHoverEnter: () => void
    onHoverExit: () => void
}


export function TabHandle(properties: ToolbarTabProps) {
    const nextHover = properties.index + 1 == properties.hoverIndex;
    const nextSelected = (properties.index + 1) == properties.selectedIndex;

    const previousSelected = properties.index - 1 == properties.selectedIndex;
    const previousHover = properties.index - 1 == properties.hoverIndex;

    const currentSelected = properties.index == properties.selectedIndex;
    const currentHover = properties.index == properties.hoverIndex;

    const topLeftColor = (() => {
        if (properties.index == 0) {
            if (currentSelected) {
                return "dark:bg-zinc-900 bg-zinc-100 rounded-tl-none"
            }
            else if (currentHover && !currentSelected) {
                return "dark:bg-zinc-800 bg-zinc-200"
            }
            else {
                return "dark:bg-zinc-700 bg-zinc-300"
            }
        }
        else {
            if (previousHover && currentSelected) {
                return "dark:bg-zinc-800 bg-zinc-200"
            }
            else if (currentHover && previousSelected) {
                return "dark:bg-zinc-800 bg-zinc-200"
            }
        }
    })()

    const topRightColor = (() => {
        if (currentHover && nextSelected) {
            return "dark:bg-zinc-800 bg-zinc-200"
        }
        else if (currentSelected && nextHover) {
            return "dark:bg-zinc-800 bg-zinc-200"
        }
        if (currentHover) {
            return "dark:bg-zinc-700 bg-zinc-300"
        }
    })()

    const bottomLeftColor = (() => {
        if (currentSelected || previousSelected) {
            return "dark:bg-zinc-900 bg-zinc-100"
        }
        else if (previousHover || (currentHover)) {
            return "dark:bg-zinc-800 bg-zinc-200"
        }
        else {
            return "dark:bg-zinc-700 bg-zinc-300"
        }
    })()

    const bottomRightColor = (() => {
        if (currentSelected || nextSelected) {
            return "dark:bg-zinc-900 bg-zinc-100"
        }
        else if (nextHover || (currentHover)) {
            return "dark:bg-zinc-800 bg-zinc-200"
        }
        else {
            return "dark:bg-zinc-700 bg-zinc-300"
        }
    })()

    const background = (() => {
        if (currentSelected) {
            return "dark:bg-zinc-900 bg-zinc-100 dark:hover:bg-zinc-900  "
        }
        else {
            return "dark:hover:bg-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 bg-zinc-300"
        }
    })();

    if (currentSelected) {
        properties.onSelect(properties.id);
    }

    return (
        <div className={`relative h-full bg-zinc-700 flex`}>
            <div className={`absolute h-2 w-2 top-0 left-0 ${topLeftColor}`} />
            <div className={`absolute h-2 w-2 top-0 right-0 ${topRightColor}`} />
            <div className={`absolute h-2 w-2 bottom-0 left-0 ${bottomLeftColor}`} />
            <div className={`absolute h-2  w-2 bottom-0 right-0 ${bottomRightColor}`} />
            <div onMouseLeave={properties.onHoverExit} onMouseEnter={() => properties.onHoverEnter()} className={` cursor-default w-60 h-full border-l-zinc-400 my-auto dark:border-l-zinc-600 z-10 rounded-b-md  text-xs font-semibold ${background} dark:text-white rounded-t-md flex`}>
                <button onClick={() => properties.onSelect(properties.id)} className="grow overflow-hidden p-1 cursor-default whitespace-nowrap">
                    <p className=" ml-1 my-auto text-left">{"{ Tab name }"}</p>
                </button>
                {
                    properties.allowClose ? (
                        <button onClick={() => properties.onClose(properties.id)} className=" cursor-default z-30 p-1 rounded-full h-6 w-6 mr-1 my-auto hover:bg-zinc-700 text-zinc-500 dark:hover:text-white hover:text-black">
                            <X className='  w-4 h-4 p-0 m-0 my-auto' />
                        </button>
                    ) : (
                        <></>
                    )
                }
            </div>
        </div>
    )
}