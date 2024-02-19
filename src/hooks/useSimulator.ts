import { invoke } from "@tauri-apps/api/tauri"

export interface SimulationOptions {
    type: SimulationType,
    path: string
}

export enum SimulationType {
    Spot = 0,
    Perpetual = 1
}

export function useSimulator() {
    async function simulate(options: SimulationOptions) {
        await invoke('run_simulation', {
            path: options.path,
            simType: options.type
        })
    }

    return {
        simulate
    }
}