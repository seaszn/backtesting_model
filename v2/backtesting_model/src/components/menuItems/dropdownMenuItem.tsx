import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { useState } from "react"
import { MenuItemProps } from "./types";
import { valueToString } from "@/lib/util";

interface DropdownProps<T> extends MenuItemProps<T> {
    items: T[],
}

export function DropdownMenuItem<T>(properties: DropdownProps<T>) {
    const [value, updateValue] = useState<T>(properties.value || properties.items[0]);

    function onValueChanged(value: T) {
        updateValue(value);
        properties.valueChanged?.(value);
    }

    return (
        <div className="h-8 w-full relative rounded-sm">
            <div className="w-full ">
                <div className="grid grid-cols-2">
                    <label className=" my-auto pl-2">{properties.title || "Value"}</label>
                    <Dropdown className="rounded-md p-0 text-black dark:text-white">
                        <div className="w-full ">
                            <div className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                <DropdownTrigger>
                                    <div className="w-full p-2 text-right h-full">
                                        <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                            {valueToString(value)}
                                        </label>
                                    </div>
                                </DropdownTrigger>
                            </div>
                        </div>
                        <DropdownMenu closeOnSelect={true} disableAnimation={true} aria-label="Static Actions" aria-selected={false} className="bg-zinc-800 overflow-hidden p-0 rounded-md border-none outline-none">
                            {
                                properties.items.map(x => {
                                    return (
                                        <DropdownItem
                                            onClick={() => onValueChanged(x)}
                                            className="hover:bg-zinc-300 bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0"
                                            key={valueToString(x)}>
                                            {valueToString(x)}
                                        </DropdownItem>
                                    )
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}