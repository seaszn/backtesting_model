'use client'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, toIterator } from "@nextui-org/react";
import { ParentComponentProperties } from "../types";
import { BarChart2, Cog, Upload } from "lucide-react";
import { useRef, useState, Fragment, MutableRefObject } from "react";
import { TimeFrame, TIME_FRAMES } from "./types";
import { DataSetType, useDataSet } from "@/lib/hooks/useData";
import { DataSetInfo } from "@/lib/hooks/useData/types";
// import { ConfigurationWindow } from "@/components/_toolbarWindows/config";

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
        <div className={'w-full max-w-full shrink flex flex-col'}>
            <div className="h-10  w-full border-b-4 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">

            </div>
            <div className={'max-w-full shrink grow flex flex-row-reverse'}>
                {/* <div className=" grow sm:border-l-4 min-h-screen justify-center z-30 flex flex-row-reverse border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-700 dark:bg-zinc-900">
                    <div className=' border-l w-0 sm:w-10 p-0 overflow-hidden sm:p-1 justify-between h-screen  border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-700 dark:bg-zinc-900'>
                        <Button onClick={() => setToolbarState(toolbarState == ToolbarState.Configuration ? ToolbarState.Collapsed : ToolbarState.Configuration)} variant="bordered" className={"border-1 border-zinc-300 dark:border-zinc-700 p-1 min-w-0 w-8 h-8 rounded-md capitalize "}>
                            <Cog className='w-10 h-10' />
                        </Button>
                    </div>

                    <div className={'z-30 transition-all bg-zinc-100 dark:bg-zinc-900 hidden sm:flex flex-col overflow-hidden justify-between h-screen ' + (toolbarState == ToolbarState.Collapsed ? "w-0 p-0" : " w-64")}>
                        {
                            {
                                'configuration': <ConfigurationWindow />,
                                // 'analytics': <Bar />
                            }[toolbarState.valueOf()]
                        }
                    </div>
                </div> */}

                <div className={"w-full h-full grow flex"}>
                    {properties.children}
                </div>
            </div>
        </div>
    )
}
