import { invoke } from "@tauri-apps/api/tauri";
import { stat } from "fs";
import { useEffect, useState } from "react"
import { singletonHook } from "react-singleton-hook"
import { DataSetInfo, DataSetState, DataSetType } from "./types";

async function refresh(path: string): Promise<DataSetInfo[]> {
    try {
        return await invoke<DataSetInfo[]>("load_data_info", { folder: path });
    }
    catch (err) {
        return [];
    }
}

function current(type: DataSetType): DataSetInfo | undefined {
    const result = localStorage.getItem(`selected_${type.valueOf()}`)

    if (result == null && result == undefined) {
        return undefined
    }
    else {
        return JSON.parse(result);
    }
}

function select_data_set(type: DataSetType, indicator: DataSetInfo) {
    localStorage.setItem(`selected_${type.valueOf()}`, JSON.stringify(indicator))
}

async function import_data_set(type: DataSetType, dataSet: DataSetInfo) {
    const formatted_name = dataSet.name.replace(" ", "_").toLowerCase();
    const response: DataSetInfo | String = await invoke<DataSetInfo | String>('import_data_set', {
        ...dataSet,
        target_path: `../data/${type.valueOf()}/${formatted_name}.json`
    });

    return response;
}

const useData = (initState: DataSetState) => {
    const [state, setState] = useState<DataSetState>(initState);

    useEffect(() => {
        state.refresh().then(x => {
            setState({
                values: x,
                refresh: state.refresh,
                current: state.current,
                select_data_set: state.select_data_set,
                import_data_set: state.import_data_set,
            });
        }).catch(x => {
            setState({
                values: [],
                refresh: state.refresh,
                current: state.current,
                select_data_set: state.select_data_set,
                import_data_set: state.import_data_set,
            });
        })
    }, []);

    return state;
}

function useDataSet(type: DataSetType) {
    const initState: DataSetState = {
        values: [],
        refresh: () => refresh(`../data/${type.valueOf()}`),
        select_data_set: (dataSet: DataSetInfo) => select_data_set(type, dataSet),
        import_data_set: (dataSet: DataSetInfo) => import_data_set(type, dataSet),
        current: () => current(type)
    }

    return singletonHook(initState, () => useData(initState))();
}

export { useDataSet, DataSetType }
