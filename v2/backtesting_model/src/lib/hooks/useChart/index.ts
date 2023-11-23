import { ColorType, CrosshairLineOptions, CrosshairMode, CrosshairOptions, GridOptions, HorzScaleOptions, LayoutOptions, LineStyle, PriceScaleMode, PriceScaleOptions, Range, Time } from "lightweight-charts";
import { ChartProperties } from "./types";
import { useState, useEffect } from "react";

const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    background: { type: ColorType.Solid, color: '#1c1917' },
    textColor: 'white',
    fontSize: 12,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`
}

const DEFAULT_GRID_OPTIONS: GridOptions = {
    vertLines: {
        color: '#44403c',
        style: LineStyle.Solid,
        visible: true
    },
    horzLines: {
        color: '#44403c',
        style: LineStyle.Solid,
        visible: true
    }
}

const DEFAULT_CROSSHAIR_LINE_OPTIONS: CrosshairLineOptions = {
    color: "#d6d3d1",
    labelBackgroundColor: 'white',
    width: 1,
    style: LineStyle.Dashed,
    visible: true,
    labelVisible: true
}

const DEFAULT_CROSSHAIR_OPTIONS: CrosshairOptions = {
    vertLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
    horzLine: DEFAULT_CROSSHAIR_LINE_OPTIONS,
    mode: CrosshairMode.Normal
}

export const DEFAULT_HORZ_SCALE_OPTIONS = {
    rightOffset: 0,
    barSpacing: 6,
    minBarSpacing: 0.5,
    fixLeftEdge: false,
    fixRightEdge: false,
    lockVisibleTimeRangeOnResize: false,
    rightBarStaysOnScroll: false,
    borderVisible: true,
    borderColor: "#2B2B43",
    visible: true,
    timeVisible: false,
    secondsVisible: true,
    shiftVisibleRangeOnNewBar: true,
    allowShiftVisibleRangeOnWhitespaceReplacement: false,
    ticksVisible: false,
    tickMarkMaxCharacterLength: undefined,
    minimumHeight: 0,
    uniformDistribution: true
}

export const DEFAULT_PRICE_SCALE_OPTIONS: PriceScaleOptions = {
    autoScale: true,
    mode: PriceScaleMode.Normal,
    invertScale: false,
    alignLabels: true,
    scaleMargins: { bottom: 0.1, top: 0.2 },
    borderVisible: false,
    borderColor: '',
    entireTextOnly: false,
    visible: true,
    ticksVisible: false,
    minimumWidth: 60
}

export function useChart(properties: ChartProperties) {

    // set the initial chart options
    const [layoutOptitons, updateLayoutOptions] = useState<LayoutOptions>(properties?.layoutOptions || DEFAULT_LAYOUT_OPTIONS);
    const [gridOptions, updateGridOptions] = useState<GridOptions>(properties?.gridOptions || DEFAULT_GRID_OPTIONS);
    const [crosshairOptions, updateCrosshairOptions] = useState<CrosshairOptions>(properties?.crosshairOptions || DEFAULT_CROSSHAIR_OPTIONS);
    const [horzScaleOptions, updateHorzScaleOptions] = useState<HorzScaleOptions>(properties?.horzScaleOptions || DEFAULT_HORZ_SCALE_OPTIONS);
    const [priceScaleOptions, priceHorzScaleOptions] = useState<PriceScaleOptions>(properties?.priceScaleOptions || DEFAULT_PRICE_SCALE_OPTIONS);

    // generate an id


    // return the renderer
    return {
        properties: {
            update: () => { }
        },
        renderer: {}
    }
}

export type {ChartProperties}