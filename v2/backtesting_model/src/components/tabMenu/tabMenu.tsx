import React, { useEffect, useState } from "react"
import { TabHandle } from "./tabHandle";
import { appWindow } from "@tauri-apps/api/window";
import { Plus } from "lucide-react";
import DragListView from "react-drag-listview";
import { TabHandleReference } from "./types";
import { generateGUId } from "@/lib/hooks/useRendererState";

export interface TabMenuProps {
    allowAddWindow?: boolean,
    initialTabs?: TabHandleReference[];
    selectedChanged?: (index: number) => void;
    tabHandlesChanged?: (handles: TabHandleReference[]) => void;
}

export function TabMenu(properties: TabMenuProps) {
    const [handles, updateTabs] = useState<TabHandleReference[]>(properties.initialTabs == undefined ? [] : properties.initialTabs)
    const [selectedId, updateSelectedId] = useState("");

    const [hoverIndex, onHover] = useState<number | undefined>(undefined);

    const lastHover = hoverIndex == (handles.length - 1)
    const lastSelected = false;

    useEffect(() => {
        if (handles.length == 0) {
            addTabWindow()
        }
    }, []);

    function updateSelected(id: string) {
        if(id != selectedId){
            properties.selectedChanged?.(getHandleIndex(id));
            updateSelectedId(id);
        }
    }

    function updateTabHandles(handles: TabHandleReference[]) {
        properties.tabHandlesChanged?.(handles);
        updateTabs(handles);
    }

    function addTabWindow() {
        const id = generateGUId();

        const updatedHandles: TabHandleReference[] = handles;
        updatedHandles.push({
            id,
        });

        updateTabHandles(updatedHandles);
        updateSelected(id);
    }

    function closeTabWindow(handle: TabHandleReference) {
        if (handles.length == 1) {
            appWindow.close();
        }
        else {
            const newTabs: TabHandleReference[] = [];
            const index = getHandleIndex(handle.id)
            // var index = 0;
            for (var i = 0; i < handles.length; i++) {
                if (handles[i].id != handle.id) {
                    newTabs.push(handles[i]);
                }
            }

            // onSelected(index + 1)
            updateTabHandles(newTabs);
        }
    }

    function getHandleIndex(id: string): number {
        for (var i = 0; i < handles.length; i++) {
            if (handles[i].id == id) {
                return i;
            }
        }

        return 0;
    }

    return (
        <div className='flex justify-evenly h-8'>
            {
                handles.map((handle, i) => {
                    return <TabHandle
                        index={i}
                        key={i}
                        id={handle.id}
                        hoverIndex={hoverIndex}
                        selectedIndex={getHandleIndex(selectedId)}
                        allowClose={true}
                        onClose={() => closeTabWindow(handle)}
                        onHoverExit={() => onHover(undefined)}
                        onHoverEnter={() => onHover(i)}
                        onSelect={() => updateSelected(handle.id)}
                    />
                })
            }
            {
                properties.allowAddWindow == true ? (
                    <div className={`relative grow h-8 w-8 ${lastSelected || lastHover ? " rounded-bl-md" : " rounded-bl-none"}`}>
                        <div className={` absolute h-2 w-2 bottom-0 left-0 z-0 ${lastSelected ? "bg-zinc-100 dark:bg-zinc-900" : (lastHover ? "bg-zinc-200 dark:bg-zinc-800" : "bg-zinc-300 dark:bg-zinc-700")}`} />
                        <div className={` absolute h-8 w-8 bg-zinc-300 dark:bg-zinc-700  p-1  ${lastHover || lastSelected ? "rounded-bl-md" : "rounded-bl-none"}`}>
                            <button onClick={() => addTabWindow()} className=" cursor-default my-auto text-xs  font-semibold rounded-full hover:bg-zinc-800 text-zinc-500 dark:hover:text-white hover:text-black px-1 h-6 w-6">
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