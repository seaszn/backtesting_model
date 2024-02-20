import EventEmitter from "events";
import { Range, Time } from "lightweight-charts";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";


type GlobalChartEvent = 'crosshair' | 'visible-range'

interface GlobalChartState {
    removeListener: (event: GlobalChartEvent, listener: (...args: any[]) => void) => void;
    addListener: (event: GlobalChartEvent, listener: (...args: any[]) => void) => void;
    crosshair?: Time;
    range?: Range<Time>;
    updateHorzCrosshair: (position: Time) => void;
    updateVisibleRange: (range: Range<Time>) => void;
}

const INIT_STATE: GlobalChartState = {
    removeListener: (_event: GlobalChartEvent, _listener: (...args: any[]) => void) => { },
    addListener: (_event: GlobalChartEvent, _listener: (...args: any[]) => void) => { },
    updateHorzCrosshair: (_position: Time) => { },
    updateVisibleRange: (_position: Range<Time>) => { }
};

export const useGlobalChartState = singletonHook(INIT_STATE, () => {
    const emitter = new EventEmitter();

    const [crosshair, updateCrosshair] = useState<Time>();
    const [range, updateRange] = useState<Range<Time>>();

    function updateVisibleRange(range: Range<Time>) {
        updateRange(range);
        emitter.emit('visible-range', range);
    }

    function updateHorzCrosshair(position: Time) {
        updateCrosshair(position);
        emitter.emit('crosshair', position);
    }

    return {
        removeListener: (event: GlobalChartEvent, listener: (...args: any[]) => void) => emitter.removeListener(event, listener),
        addListener: (event: GlobalChartEvent, listener: (...args: any[]) => void) => emitter.addListener(event, listener),

        crosshair,
        range,

        updateHorzCrosshair,
        updateVisibleRange
    }
});