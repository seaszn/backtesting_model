import { ParentComponentProperties } from "@/app/types";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

export interface SubMenuProperties<T> extends ParentComponentProperties {
    state: BaseMenuState | T
}

export enum BaseMenuState {
    Collapsed = -1e6,
}

export function SubMenu<T>(properties: SubMenuProperties<T>) {
    const [resizing, setResizing] = useState(false);

    function getResizeClassess() {
        if (resizing)
            return " transition-none"
        else
            return " transition-all ";
    }

    function getStateClassess() {
        if (properties.state == BaseMenuState.Collapsed)
            return "h-0 "
        else
            return "h-full overflow-hidden";
    }

    return (
        <Resizable
            className={"p-0 " + getStateClassess() + getResizeClassess()}
            maxHeight={properties.state == BaseMenuState.Collapsed ? "0px" : "50%"}
            minHeight={properties.state == BaseMenuState.Collapsed ? "0px" : "65px"}
            maxWidth={"100%"}
            minWidth={"100%"}
            onResizeStart={() => setResizing(true)}
            onResizeStop={() => setResizing(false)}
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
            <div className={"transition-all h-full justify-end justify-self-end border-zinc-200 dark:border-zinc-700 w-full " + (properties.state == BaseMenuState.Collapsed ? "p-0 border-0" : "p-4 border-t-4")}>
                {properties.children}
            </div>
        </Resizable>
    )
}