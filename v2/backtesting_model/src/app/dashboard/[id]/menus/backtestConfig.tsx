import { TIME_FRAMES, TimeFrame } from "@/app/chart/types";
import { FUNC_VALUES, FuncValueDropdown } from "@/components/funcValueDropdown";
import { FuncValueMenuItem } from "@/components/menuItems/FuncValueMenuItem";
import { CheckboxMenuItem } from "@/components/menuItems/checkBoxMenuItem";
import { DatePickerMenuItem } from "@/components/menuItems/datePickerMenuItem";
import { DropdownMenuItem } from "@/components/menuItems/dropdownMenuItem";
import { MenuItemSection } from "@/components/menuItems/menuItemSection";
import { ModalContext } from "@/lib/hooks/useModal/modalContext";
import { DateSelectModal } from "@/lib/modals/dateSelectModal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useState, useContext } from 'react'

interface BacktestConfigProperties {
    open: boolean
}

type SignalType = "Inside / Outside" | "Above / Below"

const SIGNAL_TYPES: SignalType[] = ["Above / Below", "Inside / Outside"]

export function BacktestConfig(properties: BacktestConfigProperties) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>(TIME_FRAMES[0])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [signalType, setSignalType] = useState(SIGNAL_TYPES[0])
    const [primaryValue, setPrimaryValue] = useState(FUNC_VALUES[0])
    const [secundaryValue, setSecundaryValue] = useState(FUNC_VALUES[0])
    const [invertSignal, setInvertSignal] = useState(false)

    return (
        <div hidden={!properties.open}>

            {/* Title Section */}
            <div className="pl-2 flex h-14 text-center border-zinc-300 font-semibold text-base dark:border-zinc-700">
                <h1 className=" my-auto">
                    Backtest Config
                </h1>
            </div>

            {/* Data Source Section */}
            <MenuItemSection removeMargin={true} keyLabel="Source" valueLabel="Value">
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
            </MenuItemSection>

            {/* Time Variables */}
            <MenuItemSection keyLabel="Property" valueLabel="Value">
                <DropdownMenuItem initValue={timeFrame} valueChanged={setTimeFrame} items={TIME_FRAMES} />
                <DatePickerMenuItem valueChanged={setStartDate} minDate={new Date(2018, 0, 1)} title="Start Date" value={startDate} />
                <DatePickerMenuItem valueChanged={setEndDate} minDate={new Date(2018, 0, 1)} title="End Date" value={endDate} />
            </MenuItemSection>

            {/* State Section */}
            <MenuItemSection keyLabel="Signal" valueLabel="Value">
                <DropdownMenuItem valueChanged={setSignalType} items={SIGNAL_TYPES} initValue={signalType} />
                <FuncValueMenuItem value={primaryValue} title={signalType == "Inside / Outside" ? "Min Value" : "Value"} valueChanged={setPrimaryValue} />
                {signalType == "Inside / Outside" ? (<FuncValueMenuItem value={secundaryValue} title="Max Value" valueChanged={setSecundaryValue} />) : null}
                <CheckboxMenuItem title="Invert signal" value={invertSignal} valueChanged={setInvertSignal} />
            </MenuItemSection>
        </div>
    );
}