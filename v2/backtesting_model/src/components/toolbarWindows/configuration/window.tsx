import { TimeFrame, TimeFrames } from "@/app/chart/types";
import { ParentComponentProperties } from "@/app/types";
import { useDataSet } from "@/lib/hooks/useData";
import { DataSetInfo, DataSetType } from "@/lib/hooks/useData/types";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { SubMenuTab } from "../../subMenu/subMenuTab";
import { BaseMenuState, SubMenu, SubMenuReference } from "@/components/subMenu/subMenu";
import { ConfigWindowMenu, ConfigSubMenuState } from "./menu";

interface ConfigurationWindowProps {
    currentMarket?: DataSetInfo
    currentIndicator?: DataSetInfo
}

export function ConfigurationWindow(properties: ConfigurationWindowProps) {
    const indicators = useDataSet(DataSetType.Indicators);
    const markets = useDataSet(DataSetType.Markets);

    const menuRef = useRef<SubMenuReference<ConfigSubMenuState>>({})

    const [currentIndicator, updateIndicator] = useState(indicators.current())
    const [currentMarket, updateMarket] = useState(markets.current())
    const [currentTimeFrame, selectTimeFrame] = useState<TimeFrame>(localStorage.getItem("selected_time_frame")! as TimeFrame);

    function onTimeFrameChanged(timeFrame: TimeFrame) {
        localStorage.setItem("selected_time_frame", timeFrame);
        selectTimeFrame(timeFrame);
    }

    return (
        <div className="relative flex flex-col h-full">
            <div className="grow p-4">
                <div className="items-center border-b pb-4 px-2 mb-4 pt-1.5 border-zinc-200 dark:border-zinc-700">
                    <h1 className="font-semibold dark:text-white">Settings</h1>
                </div>
                <div className="flex flex-col h-full">
                    <div className="px-2 grow  grid gap-1">
                        <div className='w-full'>
                            {/* <h4 className='dark:text-white  pb-4 text-sm text-black font-semibold'>Market Options</h4> */}
                            <div className='w-full'>
                                <p className='dark:text-zinc-500 pb-1 font-semibold text-tiny text-zinc-400'>Market:</p>
                                <div className='w-full flex flex-row'>
                                    <Button variant="bordered" onClick={() => menuRef.current.setMenuState?.(ConfigSubMenuState.SelectMarket)} className="border-1 border-zinc-300 rounded-md dark:border-zinc-700 capitalize grow text-left justify-start">
                                        {currentMarket?.name}
                                    </Button>
                                    <Button onClick={() => menuRef.current.setMenuState?.(ConfigSubMenuState.UploadDataSet)} variant="bordered" className=" rounded-md min-w-0 w-10 h-10 border-1 border-zinc-300 dark:border-zinc-700 ml-2 p-3 capitalize">
                                        <Upload className='w-10 h-10' />
                                    </Button>
                                </div>
                            </div>
                            <div className='w-full pt-4'>
                                <p className='dark:text-zinc-500 pb-1 font-semibold text-tiny text-zinc-400'>Time Frame:</p>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="bordered" className="capitalize w-full rounded-md border-1 border-zinc-300 dark:border-zinc-700">
                                            {currentTimeFrame}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Single selection example"
                                        variant="flat"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys="none">
                                        {TimeFrames.map((value) => (
                                            <DropdownItem key={value} variant='flat' className='dark:text-white text-black rounded-md' onClick={(e) => onTimeFrameChanged(value)}>{value}</DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                            <div className='w-full pt-10'>
                                <h4 className='dark:text-white pb-4 text-sm text-black font-semibold'>Indicator Options</h4>
                                <div className='w-full'>
                                    <p className='dark:text-zinc-500 pb-2 font-semibold text-xs text-zinc-400'>Source:</p>
                                    <div className='w-full flex flex-row'>
                                        <Button variant="bordered" onClick={() => menuRef.current.setMenuState?.(ConfigSubMenuState.SelectIndicator)} className="border-1 border-zinc-300 rounded-md dark:border-zinc-700 capitalize grow text-left justify-start">
                                            {currentIndicator?.name}
                                        </Button>
                                        <Button onClick={() => menuRef.current.setMenuState?.(ConfigSubMenuState.UploadDataSet)} variant="bordered" className=" rounded-md min-w-0 w-10 h-10 border-1 border-zinc-300 dark:border-zinc-700 ml-2 p-3 capitalize">
                                            <Upload className='w-10 h-10' />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfigWindowMenu reference={menuRef} />
        </div>
    )
}