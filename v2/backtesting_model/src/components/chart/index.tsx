
import { createChart, ColorType, GridOptions, LayoutOptions } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { TimeSeries } from './types';

interface ChartProperties {
    data: TimeSeries,
    layout: LayoutOptions,
    grid?: GridOptions
}

export default function ChartComponent(properties: ChartProperties) {
    const chartContainerRef = useRef<any>();

    useEffect(() => {
        const handleResize = () => {
            chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight)
        };

        const chart = createChart(chartContainerRef.current, {
            layout: properties.layout,
            grid: properties.grid,
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
        });
        
        chart.timeScale().fitContent();

        const newSeries = chart.addAreaSeries();
        newSeries.setData(properties.data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    },
        [
            properties.data,
            properties.layout,
            properties.grid
        ]
    );

    return (
        <div className='w-full' style={{height: "100%"}} ref={chartContainerRef}/>
    );
}