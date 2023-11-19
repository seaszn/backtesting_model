import { ParentComponentProperties } from "@/app/types";

export interface SubMenuProperties<T> extends ParentComponentProperties {
    state: BaseMenuState | T
}

export enum BaseMenuState {
    Collapsed = -1e6,
}


export interface SubMenuReference<T> {
    setMenuState?: (state: BaseMenuState | T) => void
}

export function SubMenu<T>(properties: SubMenuProperties<T>) {
    return (
        <div className={"transition-all relative justify-end justify-self-end border-zinc-200 dark:border-zinc-700 w-full " + (properties.state == BaseMenuState.Collapsed ? "h-0 p-0 border-0" : "h-1/2 p-4 border-t-4")}>
            {properties.children}
        </div>

    )
}