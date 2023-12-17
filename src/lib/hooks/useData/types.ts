export interface DataSetInfo {
    name: String,
    provider: String,
    url: String,
    store_path?: String
}

export interface DataSetState {
    values: DataSetInfo[],
    refresh: () => Promise<DataSetInfo[]>
    current: () => DataSetInfo | undefined
    select_data_set: (dataSet: DataSetInfo) => void,
    import_data_set: (dataSet: DataSetInfo) => Promise<DataSetInfo | String>,
}

export enum DataSetType {
    Indicators = "indicator",
    Markets = "market"
}