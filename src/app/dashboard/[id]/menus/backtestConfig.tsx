import { TIME_FRAMES, TimeFrame } from "@/app/chart/types";
import { FuncValueMenuItem, CheckboxMenuItem, DatePickerMenuItem, DropdownMenuItem, MenuItemSection, ListSelectMenuItem } from "@/components/menuItems";
import { FuncValue } from "@/components/menuItems/funcValueMenuItem";
import { MarketAsset, useMarketApi } from "@/lib/hooks/useApi";
import { useState, useEffect } from 'react'

interface BacktestConfigProperties {
    open: boolean,
    state: BacktestConfig
    onConfigChanged?: (current: BacktestConfig) => void;
}

type SignalType = "Inside / Outside" | "Above / Below"
const DEFAULT_START_DATE = new Date(2018, 0, 1).valueOf();

export interface BacktestConfig {
    marketAsset: MarketAsset,
    timeFrame: TimeFrame,
    startDate: Date,
    endDate: Date,
    signalType: SignalType,
    primaryValue: FuncValue,
    secundaryValue?: FuncValue,
    invertSignal: boolean
}

export function BacktestConfigMenu(properties: BacktestConfigProperties) {
    const marketApi = useMarketApi();

    useEffect(() => {
        if(marketApi.assets[0] != undefined){
            marketAssetChanged(marketApi.assets[0]);
        }
    }, [marketApi.assets])

    function stateChanged(newState: BacktestConfig) {
        properties.onConfigChanged?.(newState);
    }

    function marketAssetChanged(asset: MarketAsset) {
        if(asset != undefined){
            stateChanged({
                ...properties.state,
                marketAsset: asset,
                startDate: new Date(Math.max(asset.start_date.valueOf(), DEFAULT_START_DATE)),
            })
        }
    }

    function timeFrameChanged(timeFrame: TimeFrame) {
        stateChanged({
            ...properties.state,
            timeFrame: timeFrame
        })
    }

    function startDateChanged(date: Date) {
        stateChanged({
            ...properties.state,
            startDate: date
        })
    }

    function endDateChanged(date: Date) {
        stateChanged({
            ...properties.state,
            endDate: date
        })
    }

    function primaryValueChanged(value: FuncValue) {
        stateChanged({
            ...properties.state,
            primaryValue: value
        })
    }

    function secundaryValueChanged(value: FuncValue) {
        stateChanged({
            ...properties.state,
            secundaryValue: value
        })
    }

    function signalTypeChanged(type: SignalType) {
        if (type == 'Above / Below') {
            stateChanged({
                ...properties.state,
                signalType: type,
                primaryValue: 'mean',
                secundaryValue: undefined
            })
        }
        else {
            stateChanged({
                ...properties.state,
                signalType: type,
                primaryValue: 'mean',
                secundaryValue: 'median'
            })
        }
    }

    function invertSignalChanged(value: boolean) {
        stateChanged({
            ...properties.state,
            invertSignal: value
        })
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
            <MenuItemSection removeMargin={true} keyLabel="Source" valueLabel="Value">
                <ListSelectMenuItem title="Market" valueChanged={(e) => marketAssetChanged(e)} value={properties.state.marketAsset} items={marketApi.assets} />
                <ListSelectMenuItem title="Indicator" value={marketApi.assets[0]} items={marketApi.assets} />
            </MenuItemSection>

            {/* Time Variables */}
            <MenuItemSection keyLabel="Property" valueLabel="Value">
                <DropdownMenuItem title="Time Frame" value={properties.state.timeFrame} valueChanged={timeFrameChanged} items={TIME_FRAMES} />
                <DatePickerMenuItem valueChanged={startDateChanged} minDate={properties.state.marketAsset.start_date} title="Start Date" value={properties.state.startDate} />
                <DatePickerMenuItem valueChanged={endDateChanged} minDate={properties.state.startDate} title="End Date" value={properties.state.endDate} />
            </MenuItemSection>

            {/* State Section */}
            <MenuItemSection keyLabel="Signal" valueLabel="Value">
                <DropdownMenuItem title="Type" valueChanged={signalTypeChanged} items={["Above / Below", "Inside / Outside"]} value={properties.state.signalType} />
                <FuncValueMenuItem value={properties.state.primaryValue} title={properties.state.signalType == "Inside / Outside" ? "Min Value" : "Value"} valueChanged={primaryValueChanged} />
                {properties.state.signalType == "Inside / Outside" ? (<FuncValueMenuItem value={properties.state.secundaryValue} title="Max Value" valueChanged={secundaryValueChanged} />) : null}
                <CheckboxMenuItem title="Invert signal" value={properties.state.invertSignal} valueChanged={invertSignalChanged} />
            </MenuItemSection>
        </div>
    );
}