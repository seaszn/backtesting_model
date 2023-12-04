'use client'

import { ChartRenderer } from "@/components/chartRenderer";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { Range, Time } from "lightweight-charts";
import { useState } from "react"
import { DashboardProperties } from "./types";
import { Eye, PlusCircle, Search, Terminal, User, X, } from "lucide-react";
import { Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { IconButton } from "@/components/iconButton";
import { S4 } from "@/lib/guid";
import { BacktestConfig, BacktestConfigMenu } from "./menus/backtestConfig";
import { ModalProvider } from "@/lib/hooks/useModal/modalContext";
import { TIME_FRAMES } from "@/app/chart/types";
import { EMPTY_ASSET } from "@/lib/hooks/useApi";

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];

export default function DashboardPage(properties: DashboardProperties) {
    const dashboard = useDashboard(properties.params.id)

    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const [backtestConfig, setBacktestConfig] = useState<BacktestConfig>({
        marketAsset: EMPTY_ASSET,
        timeFrame: TIME_FRAMES[0],
        startDate: new Date(),
        endDate: new Date(),
        signalType: 'Above / Below',
        primaryValue: 'mean',
        secundaryValue: undefined,
        invertSignal: false
    });

    function backtestConfigChanged(old: BacktestConfig | undefined, current: BacktestConfig){
        if(current.marketAsset != undefined){
            setBacktestConfig(current);
            console.log(current.marketAsset)
        }
    }

    function onRightMenuStateChanged(open: boolean) {
        setRightMenuOpen(open);
    }

    function onChartVisibleRangeChanged(timeRange: Range<number>, id: string) {
        // switch (id) {
        // case priceChartRef.current.id?.():
        //     indicatorChartRef.current.setVisibleTimeRange?.(timeRange);
        //     break;
        // case priceChartRef.current.id?.():
        //     priceChartRef.current.setVisibleTimeRange?.(timeRange);
        //     break;
        // }
    }

    function onChartCrosshairMoved(value: number, time: Time, id: string) {
        //     switch (id) {
        //         case priceChartRef.current.id?.():
        //             indicatorChartRef.current.setCrosshairPosition?.(0, time);
        //             break;
        //         case indicatorChartRef.current.id?.():
        //             priceChartRef.current.setCrosshairPosition?.(0, time);
        //             break;
        //     }
    }

    return (
        <ModalProvider>
            <div className="grid gap-1 w-full h-full relative  pb-10" style={{ gridTemplateRows: "2rem 1fr" }}>
                <div className="grid grid-cols-2 gap-1 bg-zinc-100 dark:bg-zinc-900" style={{ gridTemplateColumns: "3rem 1fr" }}>
                    <Dropdown className="rounded-md p-0 text-black dark:text-white">
                        <DropdownTrigger>
                            <button className={`m-0.5 h-7 grow enabled:hover:bg-zinc-300 enabled:active:bg-zinc-100 enabled:dark:hover:bg-zinc-700 enabled:dark:active:bg-zinc-800 rounded-md`}>
                                <div className='w-6 h-6 mx-auto bg-blue-500 rounded-full '>
                                    <User className="p-0.5 stroke-1 w-6 h-6 mx-auto my-auto" />
                                </div>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions" className="bg-zinc-800 overflow-hidden p-0 rounded-md border-none outline-none">
                            <DropdownItem className="hover:bg-zinc-300 bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0" key="preferences">Preferences</DropdownItem>
                            <DropdownItem className="hover:bg-zinc-300 bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 rounded-none m-0" key="quit">Quit</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div className="h-full w-full flex">
                        <IconButton className="h-7 w-7 m-0.5" icon={<PlusCircle className="stroke-1 h-5 w-5 mx-auto" />} />
                        <IconButton className="h-7 w-7 m-0.5" icon={<Search className="stroke-1 h-5 w-5 mx-auto" />} />
                        <Divider orientation="vertical" className="my-1 h-auto m-2 dark:bg-zinc-700 bg-zinc-300 " />
                    </div>
                </div>
                <div className="grid gap-1 relative grid-cols-3 overflow-hidden max-h-full mb-8 w-full h-full" style={{ gridTemplateColumns: `3rem 1fr ${rightMenuOpen ? "20rem" : "3rem"}` }}>
                    <div className="block dark:bg-zinc-900 text-black dark:text-white p-2 bg-zinc-100 rounded-tr-md" >
                        <IconButton icon={<Terminal style={{ strokeWidth: '1px' }} className="h-auto w-auto" />} />
                        <IconButton icon={<Eye style={{ strokeWidth: '1px' }} className="h-auto w-auto" />} />
                    </div>
                    <div className="block overflow-hidden rounded-t-md" >
                        <ChartRenderer onCrosshairMoved={onChartCrosshairMoved} onVisibleRangeChanged={onChartVisibleRangeChanged} data={initialData} id={S4() + S4()} />
                    </div>
                    <div className="block text-xs dark:bg-zinc-900 text-black dark:text-white bg-zinc-100 rounded-tl-md" >
                        <div className="grid grid-cols-2 h-full w-full" style={{ gridTemplateColumns: `${rightMenuOpen ? "17rem 3rem" : ""}` }}>
                            <BacktestConfigMenu  onConfigChanged={backtestConfigChanged} state={backtestConfig} open={rightMenuOpen} />
                            <div className="p-2 border-l border-zinc-300 dark:border-zinc-700">
                                <IconButton onClick={() => onRightMenuStateChanged(!rightMenuOpen)} icon={<Terminal style={{ strokeWidth: '1px' }} className="h-auto w-auto" />} />
                                <IconButton icon={<Eye style={{ strokeWidth: '1px' }} className="h-auto w-auto" />} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalProvider>
    )
}