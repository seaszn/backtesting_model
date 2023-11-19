import { ParentComponentProperties } from "@/app/types";
import { Resizable } from "re-resizable";

export interface SubMenuProperties<T> extends ParentComponentProperties {
    state: BaseMenuState | T
}

export enum BaseMenuState {
    Collapsed = -1e6,
}

export function SubMenu<T>(properties: SubMenuProperties<T>) {
    return (
        <Resizable
            className={"p-0" + (properties.state == BaseMenuState.Collapsed ? "h-0" : "h-full overflow-hidden")}
            maxHeight={properties.state == BaseMenuState.Collapsed ? "0px" : "50%"}
            minHeight={properties.state == BaseMenuState.Collapsed ? "0px" : "10%"}
            maxWidth={"100%"}
            minWidth={"100%"}
            enable={{
                top: true,
                topLeft: false,
                topRight: false,
                left: false,
                bottomLeft: false,
                bottomRight: false,
                bottom: false,
                right: false
            }}>
            <div className={"relative h-full justify-end justify-self-end border-zinc-200 dark:border-zinc-700 w-full " + (properties.state == BaseMenuState.Collapsed ? "p-0 border-0" : "p-4 border-t-4")}>
                {properties.children}
            </div>
        </Resizable>

    )
}