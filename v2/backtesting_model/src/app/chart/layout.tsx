'use client'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { ParentComponentProperties } from "../types";
import { BarChart2, Cog, Upload } from "lucide-react";
import { useRef, useState, Fragment, MutableRefObject } from "react";
import { TimeFrame, TimeFrames } from "./types";
import { DataSetType, useDataSet } from "@/lib/hooks/useData";
import { DataSetInfo } from "@/lib/hooks/useData/types";
import { ConfigurationWindow } from "@/components/toolbarWindows/config";

enum ToolbarState {
    Collapsed = "",
    Configuration = "configuration",
    Analytics = "analytics"
}

export default function ChartLayout(properties: ParentComponentProperties) {
    const indicators = useDataSet(DataSetType.Indicators);
    const markets = useDataSet(DataSetType.Markets);

    const [toolbarState, setToolbarState] = useState(ToolbarState.Configuration);
    const [currentIndicator, updateIndicator] = useState(indicators.current())
    const [currentMarket, updateMarket] = useState(markets.current())
    const [currentTimeFrame, selectTimeFrame] = useState<TimeFrame>(localStorage.getItem("selected_time_frame")! as TimeFrame);

    function onTimeFrameChanged(timeFrame: TimeFrame) {
        localStorage.setItem("selected_time_frame", timeFrame);
        selectTimeFrame(timeFrame);
    }

    return (
        <div className='min-w-full min-h-screen flex flex-row-reverse'>
            <div className="w-auto sm:border-l-4 min-h-screen z-30 flex flex-row-reverse border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-700 dark:bg-zinc-900">
                <div className=' border-l w-0 sm:w-14 p-0 overflow-hidden  sm:p-2 sm:pt-4 justify-between h-screen  border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-700 dark:bg-zinc-900'>
                    <Button onClick={() => setToolbarState(toolbarState == ToolbarState.Configuration ? ToolbarState.Collapsed : ToolbarState.Configuration)} variant="bordered" className={"border-1 border-zinc-300 dark:border-zinc-700 min-w-0 w-10 h-10 p-2 capitalize "}>
                        <Cog className='w-10 h-10' />
                    </Button>
                    <Button onClick={() => setToolbarState(toolbarState == ToolbarState.Analytics ? ToolbarState.Collapsed : ToolbarState.Analytics)} variant="bordered" className={"border-1 border-zinc-300 dark:border-zinc-700 min-w-0 w-10 h-10 p-2 capitalize mt-2 "}>
                        <BarChart2 className='w-10 h-10' />
                    </Button>
                </div>

                <div className={'z-30 transition-all bg-zinc-100 dark:bg-zinc-900 hidden sm:flex flex-col overflow-hidden justify-between h-screen ' + (toolbarState == ToolbarState.Collapsed ? "w-0 p-0" : " w-80")}>
                    {
                        {
                            'configuration': <ConfigurationWindow/>,
                            // 'analytics': <Bar />
                        }[toolbarState.valueOf()]
                    }
                </div>
            </div>

            {/* Middle Section */}
            <div className="grow relative min-h-screen dark:bg-zinc-900 bg-zinc-100">
                {properties.children}
            </div>


        </div>
    )
}
