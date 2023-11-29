import { TIME_FRAMES, TimeFrame } from "@/app/chart/types";
import { FuncValueMenuItem, CheckboxMenuItem, DatePickerMenuItem, DropdownMenuItem, MenuItemSection, FUNC_VALUES, ListSelectMenuItem } from "@/components/menuItems";
import { FuncValue } from "@/components/menuItems/funcValueMenuItem";
import { MarketInfo } from "@/lib/modals/marketSelectModal";
import { useState } from 'react'

interface BacktestConfigProperties {
    open: boolean
}

type SignalType = "Inside / Outside" | "Above / Below"

const markets: MarketInfo[] = [
    {
        name: 'Bitcoin',
        symbol: 'BTCUSD',
        source: 'https://www.google.com'
    },
    {
        name: 'Ethereum',
        symbol: 'ETHUSD',
        source: 'https://www.google.com'
    },
    {
        name: 'Solana',
        symbol: 'SOLUSD',
        source: 'https://www.google.com'
    }
]

export function BacktestConfig(properties: BacktestConfigProperties) {

    const [timeFrame, setTimeFrame] = useState<TimeFrame>(TIME_FRAMES[0])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const [signalType, setSignalType] = useState<SignalType>('Above / Below')
    const [primaryValue, setPrimaryValue] = useState<FuncValue>('mean')
    const [secundaryValue, setSecundaryValue] = useState<FuncValue>(1)
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
                <ListSelectMenuItem value={markets[0]} items={markets} />
                <ListSelectMenuItem title="Indicator" value={markets[0]} items={markets} />
                {/* <ListSelectMenuItem title="Select Indicator" value={'ts'} items={['ts', 'ta']} /> */}
            </MenuItemSection>

            {/* Time Variables */}
            <MenuItemSection keyLabel="Property" valueLabel="Value">
                <DropdownMenuItem value={timeFrame} valueChanged={setTimeFrame} items={TIME_FRAMES} />
                <DatePickerMenuItem valueChanged={setStartDate} minDate={new Date(2018, 0, 1)} title="Start Date" value={startDate} />
                <DatePickerMenuItem valueChanged={setEndDate} minDate={new Date(2018, 0, 1)} title="End Date" value={endDate} />
            </MenuItemSection>

            {/* State Section */}
            <MenuItemSection keyLabel="Signal" valueLabel="Value">
                <DropdownMenuItem valueChanged={setSignalType} items={["Above / Below", "Inside / Outside"]} value={signalType} />
                <FuncValueMenuItem value={primaryValue} title={signalType == "Inside / Outside" ? "Min Value" : "Value"} valueChanged={setPrimaryValue} />
                {signalType == "Inside / Outside" ? (<FuncValueMenuItem value={secundaryValue} title="Max Value" valueChanged={setSecundaryValue} />) : null}
                <CheckboxMenuItem title="Invert signal" value={invertSignal} valueChanged={setInvertSignal} />
            </MenuItemSection>
        </div>
    );
}