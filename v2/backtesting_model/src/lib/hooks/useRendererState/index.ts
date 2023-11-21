'client side'

// import { useState, useEffect } from "react"
// import { singletonHook } from "react-singleton-hook"
import { generateGUId } from "./GUIdGenerator"

interface RendererStateHandler {
    current: () => RendererState
    update: (state: RendererState) => void;
}

interface RendererState {
    title: string
}

const INIT_STATE: RendererState = {
    title: ""
}

function updateRendererState(id: string, state: RendererState) {
    localStorage.setItem(id, JSON.stringify(state))
}

function getRendererState(id: string): RendererState {
    const result = localStorage.getItem(id)

    if (result == null || result == undefined) {
        updateRendererState(id, INIT_STATE);
        return INIT_STATE;
    }
    else {
        return JSON.parse(result);
    }
}

function useRendererState(id: string): RendererStateHandler{
    return {
        current: () => getRendererState(id),
        update: (state: RendererState) => updateRendererState(id, state)
    }
}

export { generateGUId, useRendererState };
export type { RendererState };
