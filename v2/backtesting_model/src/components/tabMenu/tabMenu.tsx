import React, { useEffect, useState } from "react"
import { TabHandle } from "./tabHandle";
import { appWindow } from "@tauri-apps/api/window";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/hooks/useSession";
import { generateGUId } from "@/lib/guid";

export interface TabMenuProps {
    allowAddWindow?: boolean,
    initialTabs?: string[];
    onSelectionChanged?: (id: string) => void;
    onTabsChanged?: (handles: string[]) => void;
}

export function TabMenu(properties: TabMenuProps) {
    const [handleIds, updateTabs] = useState<string[]>(properties.initialTabs == undefined ? [] : properties.initialTabs)
    const [currentHandleId, updateSelectedId] = useState("");
    const [hoverIndex, onHover] = useState<number | undefined>(undefined);

    const lastHover = hoverIndex == (handleIds.length - 1)
    const lastSelected = false;

    useEffect(() => {
        if (handleIds.length == 0) {
            openWindow()
        }
    }, []);

    function updateCurrent(id: string) {
        if (id != currentHandleId) {
            updateSelectedId(id);

            properties.onSelectionChanged?.(id);
        }
    }

    function updateHandles(handles: string[]) {
        properties.onTabsChanged?.(handles);
        updateTabs(handles);
    }

    function openWindow() {
        const id = generateGUId();
        const updatedHandles: string[] = handleIds;

        updatedHandles.push(id);

        updateHandles(updatedHandles);
        updateCurrent(id);
    }

    function closeWindow(handleId: string) {
        if (handleIds.length == 1) {
            appWindow.close();
        }
        else {
            const newTabs: string[] = [];
            for (var i = 0; i < handleIds.length; i++) {
                if (handleIds[i] != handleId) {
                    newTabs.push(handleIds[i]);
                }
            }

            updateHandles(newTabs);
        }
    }

    function getHandleIndex(id: string): number {
        for (var i = 0; i < handleIds.length; i++) {
            if (handleIds[i] == id) {
                return i;
            }
        }

        return 0;
    }

    return (
        <div className='flex justify-evenly h-8'>
            {
                handleIds.map((handleId, i) => {
                    return <TabHandle
                        index={i}
                        key={i}
                        id={handleId}
                        hoverIndex={hoverIndex}
                        selectedIndex={getHandleIndex(currentHandleId)}
                        allowClose={true}
                        onClose={() => closeWindow(handleId)}
                        onHoverExit={() => onHover(undefined)}
                        onHoverEnter={() => onHover(i)}
                        onSelect={() => updateCurrent(handleId)}
                    />
                })
            }
            {
                properties.allowAddWindow == true ? (
                    <div className={`relative grow h-8 w-8 ${lastSelected || lastHover ? " rounded-bl-md" : " rounded-bl-none"}`}>
                        <div className={` absolute h-2 w-2 bottom-0 left-0 z-0 ${lastSelected ? "bg-zinc-100 dark:bg-zinc-900" : (lastHover ? "bg-zinc-200 dark:bg-zinc-800" : "bg-zinc-300 dark:bg-zinc-700")}`} />
                        <div className={` absolute h-8 w-8 bg-zinc-300 dark:bg-zinc-700  p-1  ${lastHover || lastSelected ? "rounded-bl-md" : "rounded-bl-none"}`}>
                            <button onClick={() => openWindow()} className=" cursor-default my-auto text-xs  font-semibold rounded-full hover:bg-zinc-800 text-zinc-500 dark:hover:text-white hover:text-black px-1 h-6 w-6">
                                <Plus className='w-4 h-4 p-0 m-0' />
                            </button>
                        </div>
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    )
}