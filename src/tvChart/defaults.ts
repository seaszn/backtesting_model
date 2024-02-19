import { ColorType, CrosshairLineOptions, CrosshairMode, CrosshairOptions, GridOptions, LayoutOptions, LineStyle, PriceScaleMode, PriceScaleOptions } from "lightweight-charts"

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    background: { type: ColorType.Solid, color: '#0a0a0a' },
    textColor: 'white',
    fontSize: 10,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif`
}

export const DEFAULT_GRID_OPTIONS: GridOptions = {
    vertLines: {
        color: '#262626',
        style: LineStyle.Solid,
        visible: true
    },
    horzLines: {
        color: '#262626',
        style: LineStyle.Solid,
        visible: true
    }
}

export const DEFAULT_CROSSHAIR_LINE_OPTIONS: CrosshairLineOptions = {
    color: "#d6d3d1",
    labelBackgroundColor: 'white',
    width: 1,
    style: LineStyle.Dashed,
    visible: true,
    labelVisible: true
}

export const DEFAULT_CROSSHAIR_OPTIONS: CrosshairOptions = {
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
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: false,
    borderVisible: true,
    borderColor: "#2B2B43",
    visible: true,
    timeVisible: true,
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
    minimumWidth: 64
}