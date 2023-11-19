import { ParentComponentProperties } from "@/app/types";
import { Button } from "@nextui-org/react";
import { X } from "lucide-react";
import { BaseMenuState } from "./subMenu";

interface SubMenuTabProperties<T> extends ParentComponentProperties {
    title: String
    state: BaseMenuState | T;
    type: BaseMenuState | T;
    setSubMenuState?: (state: BaseMenuState | T) => void;
}
export function SubMenuTab<T>(properties: SubMenuTabProperties<T>) {
    return (
        <div className={"w-full overflow-hidden transition-all " + (properties.state == properties.type ? " opacity-100  h-full" : " h-0 opacity-0")}>
            <div className="items-center border-b flex flex-row pb-4 px-2 mb-4 pt-1.5 border-zinc-200 dark:border-zinc-700">
                <h1 className=" grow font-semibold dark:text-white my-auto">{properties.title}</h1>
                <Button onClick={() => properties.setSubMenuState?.(BaseMenuState.Collapsed)} className={"self-end border-zinc-300 dark:border-zinc-700 min-w-0 w-6 h-6 p-1 rounded-full capitalize my-auto bg-transparent border-none hover:bg-zinc-200 hover:dark:bg-zinc-700 "}>
                    <X className='w-10 h-10' />
                </Button>
            </div>
            <div className=" w-full h-full">
                {properties.children}
            </div>
        </div>
    )
}