import { ParentComponentProperties } from "@/app/types";
import React, { useEffect, useState } from "react";
import { TabHandleReference } from "./types";

export interface TabMenuCanvasProps extends ParentComponentProperties {
    className?: string
}

export function TabMenuCanvas(properties: TabMenuCanvasProps) {
    return (
        <div className={`text-black text-sm dark:text-white bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 border-zinc-300 ${properties.className}`}>
            {properties.children}
        </div>
    )
}