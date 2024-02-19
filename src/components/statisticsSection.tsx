import React, { useEffect, useRef, useState } from "react"
import { StatisticValue, StatisticValueProps } from "./statisticsValue"
import { ChevronDown, ChevronLeft } from "lucide-react"
import { StatisticDateProps } from "./statisticsDate";

interface StatisticsSectionProps<T extends number> {
    header?: string
    collapsable?: boolean;
    defaultCollapsed?: boolean;
    children: Iterable<React.ReactElement<StatisticValueProps<T> | StatisticsSectionProps<T> | StatisticDateProps>>
    onFocus?: () => void
}

export function StatisticsSection<T extends number>(props: StatisticsSectionProps<T>) {
    const [loading, updateLoading] = useState(true);
    const [collapsed, updateCollapsed] = useState(true);
    const containerRef = useRef<any | undefined>();

    useEffect(() => {
        if (containerRef.current) {
            updateLoading(false);
            updateCollapsed(props.defaultCollapsed || false);
        }
    }, [containerRef.current, props.children])

    function controlStyles() {
        return props.collapsable == true ? 'hover:text-indigo-500 hover:border-indigo-500 active:border-indigo-700 active:text-indigo-700' : '';
    }

    return (
        <div className="mt-6 flex flex-col select-none">
            {props.header && (
                <div onClick={() => props.collapsable == true && updateCollapsed(!collapsed)} className={`flex justify-between transition-colors   border-b border-neutral-700  pb-2 text-neutral-300 ${controlStyles()}`}>
                    <h1 className='text-md font-semibold '>{props.header}</h1>
                    {props.collapsable == true && (
                        <div className=" h-5 my-auto flex w-5 p-0.5 mr-2">
                            <ChevronDown strokeWidth={2} className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-90' : ''}`} />
                        </div>
                    )}
                </div>
            )}
            <div className={`overflow-hidden transition-all max-h-fit grow shrink`} style={{ height: collapsed || loading ? '0px' : containerRef.current != undefined ? `${containerRef.current.clientHeight + 1}px` : 'auto' }}>
                <div ref={containerRef} className='p-4 border-x border-b  py-4 border-neutral-700'>
                    <div>
                        {props.children}
                    </div>
                    {props.onFocus && (
                        <button className=" mt-4 border text-indigo-500 text-xs border-indigo-500 font-semibold hover:bg-indigo-500 hover:text-neutral-300 transition-colors active:bg-indigo-700 active:border-indigo-700 p-1 w-full">
                            Focus
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}