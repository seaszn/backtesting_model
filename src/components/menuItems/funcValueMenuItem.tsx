import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { X } from "lucide-react";
import { useState } from "react"
import { MenuItemProps } from "./types";
import { pascalCase } from "@/lib/util";

export type FuncValue = "mean" | "median" | "mode" | number
export const FUNC_VALUES: FuncValue[] = ["mean", "median", "mode"]

export function FuncValueMenuItem(properties: MenuItemProps<FuncValue>) {
    const initValue = properties.value || FUNC_VALUES[0];

    const [isFocussed, setFocussed] = useState(false);
    const [isHovererd, setHovered] = useState(false);
    const [isCustomized, setCustomized] = useState(!isFuncValue(initValue));
    const [value, setValue] = useState<FuncValue>(initValue);

    function onValueChanged(value: FuncValue) {
        setValue(value);
        properties.valueChanged?.(value);
    }

    function onCustomClicked() {
        setValue(0);
        setCustomized(true)
    }

    function isFuncValue(input: string | number): input is FuncValue {
        return typeof input != 'number'
        // for (var func in FUNC_VALUES) {
        //     if (input.toString() == func.toString()) {
        //         return true;
        //     }
        // }

        // return false;
    }

    function getCustomizedView() {
        return (
            <div className={`overflow-hidden relative border-b w-full h-full pr-2 border-zinc-300 dark:border-zinc-700 ${isFocussed || isHovererd ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-100 dark:bg-zinc-900"}`}>
                <div onClick={() => {
                    setCustomized(false);
                    onValueChanged(FUNC_VALUES[0])
                }} className="absolute rounded-full top-1/2 -translate-y-1/2 h-4 w-4 hover:bg-zinc-300 dark:hover:bg-zinc-700  z-20 my-auto">
                    <X strokeWidth={"1px"} className="my-auto relative h-4 w-4" />
                </div>
                <input
                    type="number"
                    step="0.01"
                    value={value as number}
                    onMouseEnter={() => {
                        setHovered(true)
                    }}
                    onMouseLeave={() => {
                        setHovered(false)
                    }}
                    onFocus={() => {
                        setFocussed(true);
                    }}
                    onBlur={() => {
                        setFocussed(false);
                    }}
                    onChange={(e) => {
                        if (e.currentTarget.value != "") {
                            const parsed = parseFloat(e.currentTarget.value)

                            if (!isNaN(parsed)) {
                                onValueChanged(parsed)
                            }
                            else if (isFuncValue(e.currentTarget.value)) {
                                onValueChanged(e.currentTarget.value);
                            }
                        }
                    }}
                    style={{}}
                    className=" relative w-full h-full min-w-0 border-collapse outline-none bg-zinc-100 dark:bg-zinc-900 py-2 hover:bg-zinc-300 focus:dark:bg-zinc-700 focus:bg-zinc-300 dark:hover:bg-zinc-700 text-right"
                />
            </div>
        )
    }

    function getDropdownView() {
        return (
            <Dropdown className="rounded-md p-0 text-black dark:text-white">
                <div className="w-full ">
                    <div className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                        <DropdownTrigger>
                            <div className="w-full p-2 text-right h-full">
                                <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                    {value}
                                </label>
                            </div>
                        </DropdownTrigger>
                    </div>
                </div>
                <DropdownMenu closeOnSelect={true} disableAnimation={true} aria-label="Static Actions" aria-selected={false} className="bg-zinc-800 overflow-hidden p-0 rounded-md border-none outline-none">
                    {[
                        ...FUNC_VALUES.map(x => {
                            return (
                                <DropdownItem onClick={() => onValueChanged(x)}
                                    className="hover:bg-zinc-300 bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0"
                                    key={x}>
                                    {x}
                                </DropdownItem>
                            )
                        }),
                        <DropdownItem onClick={onCustomClicked}
                            className="hover:bg-zinc-300 text-xs bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0"
                            key={"custom"}
                            style={{ fontSize: "10px" }}>
                            Custom
                        </DropdownItem>
                    ]}

                </DropdownMenu>
            </Dropdown>
        )
    }

    return (
        <div className="h-8 w-full rounded-sm">
            <div className="w-full">
                <div className="grid grid-cols-2">
                    <label className="my-auto pl-2">{properties.title}</label>
                    {isCustomized ? getCustomizedView() : getDropdownView()}
                </div>
            </div>
        </div>
    )
}