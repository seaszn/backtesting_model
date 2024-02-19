import EventEmitter from "events";
import { Range, Time } from "lightweight-charts";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";


type GlobalChartEvent = 'crosshair' | 'visible-range'

const INIT_STATE = {
    removeListener: (_event: GlobalChartEvent, _listener: (...args: any[]) => void) => { },
    addListener: (_event: GlobalChartEvent, _listener: (...args: any[]) => void) => { },
    updateHorzCrosshair: (_position: Time) => { },
    updateVisibleRange: (_position: Range<Time>) => { }
};

export const useGlobalChartState = singletonHook(INIT_STATE, () => {
    const emitter = new EventEmitter();

    function updateVisibleRange(range: Range<Time>) {
        emitter.emit('visible-range', range);
    }

    function updateHorzCrosshair(position: Time) {
        emitter.emit('crosshair', position);
    }

    return {
        removeListener: (event: GlobalChartEvent, listener: (...args: any[]) => void) => emitter.removeListener(event, listener),
        addListener: (event: GlobalChartEvent, listener: (...args: any[]) => void) => emitter.addListener(event, listener),
        updateHorzCrosshair,
        updateVisibleRange
    }
});