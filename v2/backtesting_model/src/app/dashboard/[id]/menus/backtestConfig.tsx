import { TIME_FRAMES, TimeFrame } from "@/app/chart/types";
import { FuncValueDropdown } from "@/components/funcValueDropdown";
import { ModalContext } from "@/lib/hooks/useModal/modalContext";
import { DateSelectModal } from "@/lib/modals/dateSelectModal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useState, useContext } from 'react'

interface BacktestConfigProperties {
    open: boolean
}

type SignalType = "Inside / Outside" | "Above / Below"

const SIGNAL_TYPES: SignalType[] = ["Inside / Outside", "Above / Below"]

export function BacktestConfig(properties: BacktestConfigProperties) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>(TIME_FRAMES[0])
    const [signalType, setSignalType] = useState(SIGNAL_TYPES[0])
    const { updateModal } = useContext(ModalContext);

    function updateTimeFrame(timeFrame: TimeFrame) {
        setTimeFrame(timeFrame);
    }

    function onSignalTypeChanged(type: SignalType) {
        setSignalType(type);
    }

    return (
        <div hidden={!properties.open}>

            {/* Title Section */}
            <div className="pl-2 flex h-14 text-center border-zinc-300 font-semibold text-base dark:border-zinc-700">
                <h1 className=" my-auto">
                    Backtest Config
                </h1>

            </div>

            {/* Data Source Section */}
            <div>
                <div>
                    <div className="w-full px-2 grid-cols-2 grid h-6 dark:border-zinc-700 border-zinc-300 border-b">
                        <div className=" py-0.5 h-6  text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                            Source
                        </div>
                        <div className=" h-6 py-0.5 text-right text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                            Value
                        </div>
                    </div>
                </div>
                <div className="h-8 w-full rounded-sm">
                    <div className="w-full ">
                        <div className="grid grid-cols-2">
                            <label className="my-auto pl-2">Market</label>
                            <button className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                <div className="w-full p-2 text-right h-full">
                                    <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                        Bitcoin
                                    </label>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-full rounded-sm">
                    <div className="w-full ">
                        <div className="grid grid-cols-2">
                            <label className="my-auto pl-2">Indicator</label>
                            <button className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                <div className="w-full p-2 text-right h-full">
                                    <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                        STH - MVRV
                                    </label>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Time Variables */}
            <div className="mt-10">
                <div>
                    <div className="w-full px-2 grid-cols-2 grid h-6 dark:border-zinc-700 border-zinc-300 border-b">
                        <div className=" py-0.5 h-6  text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                            Property
                        </div>
                        <div className=" h-6 py-0.5 text-right text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                            Value
                        </div>
                    </div>
                </div>

                <div className="h-8 w-full rounded-sm">
                    <Dropdown className="rounded-md transition-none p-0 text-black dark:text-white">
                        <div className="w-full relative">
                            <div className="grid grid-cols-2">
                                <label className="my-auto pl-2">Time frame</label>
                                <div className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                    <DropdownTrigger>
                                        <div className="w-full p-2 text-right h-full">
                                            <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                                {timeFrame}
                                            </label>
                                        </div>
                                    </DropdownTrigger>
                                </div>
                            </div>
                        </div>
                        <DropdownMenu closeOnSelect={true} disableAnimation={true} aria-selected={false} className="bg-zinc-800 overflow-hidden p-0 rounded-md border-none outline-none">
                            {
                                TIME_FRAMES.map(tf => {
                                    return (
                                        <DropdownItem
                                            onClick={() => updateTimeFrame(tf)}
                                            className="hover:bg-zinc-300 bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0"
                                            key={tf}>
                                            {tf}
                                        </DropdownItem>
                                    )
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="h-8 w-full rounded-sm">
                    <div className="w-full ">
                        <div className="grid grid-cols-2">
                            <label className="my-auto pl-2">Start date</label>
                            <button onClick={() => {
                                updateModal?.({
                                    backdrop: false,
                                    closeOnClickOutside: true,
                                    content: <DateSelectModal minDate={new Date(2018, 0, 1)} />,
                                    title: "Start Date",
                                    allowClose: true
                                });
                            }} className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                <div className="w-full p-2 text-right h-full">
                                    <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                        11-26-2023
                                    </label>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-full rounded-sm">
                    <div className="w-full ">
                        <div className="grid grid-cols-2">
                            <label className="my-auto pl-2">End date</label>
                            <button className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                <div className="w-full p-2 text-right h-full">
                                    <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                        11-26-2023
                                    </label>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bullish Section */}
            <div className="mt-10">
                <div>
                    <div className="w-full px-2 grid-cols-2 grid h-6 dark:border-zinc-700 border-zinc-300 border-b">
                        <div className=" py-0.5 h-6  text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                            Signal
                        </div>
                        <div className=" h-6 py-0.5 text-right text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                            Value
                        </div>
                    </div>
                </div>

                <div className="h-8 w-full relative rounded-sm">
                    <div className="w-full ">
                        <div className="grid grid-cols-2">
                            <label className=" my-auto pl-2">Type</label>
                            <Dropdown className="rounded-md p-0 text-black dark:text-white">
                                <div className="w-full ">
                                    <div className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                        <DropdownTrigger>
                                            <div className="w-full p-2 text-right h-full">
                                                <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                                    {signalType}
                                                </label>
                                            </div>
                                        </DropdownTrigger>
                                    </div>
                                </div>
                                <DropdownMenu closeOnSelect={true} disableAnimation={true} aria-label="Static Actions" aria-selected={false} className="bg-zinc-800 overflow-hidden p-0 rounded-md border-none outline-none">
                                    {
                                        SIGNAL_TYPES.map(x => {
                                            return (
                                                <DropdownItem
                                                    onClick={() => onSignalTypeChanged(x)}
                                                    className="hover:bg-zinc-300 bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0"
                                                    key={x}>
                                                    {x}
                                                </DropdownItem>
                                            )
                                        })
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-full rounded-sm">
                    <div className="w-full">
                        <div className="grid grid-cols-2">
                            <label className="my-auto pl-2">Value</label>
                            <FuncValueDropdown />
                        </div>
                    </div>
                </div>
                <div className="h-8 w-full rounded-sm">
                    <div className="w-full">
                        <div className="grid grid-cols-2">
                            <label className="my-auto pl-2">Invert signal</label>
                            <div className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 ">
                                <div className="w-full p-2 text-right h-full">
                                    <input type='checkbox' className="w-8 h-8 rounded-sm checked:bg-blue-600 bg-zinc-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}