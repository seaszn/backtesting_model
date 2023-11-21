import { Input } from "@nextui-org/react";
import { TabHandleReference } from "../tabMenu";
import { RendererState, useRendererState } from "@/lib/hooks/useRendererState";
import { useState, useEffect } from "react";

export interface PageRendererProps {
    handle: TabHandleReference,
    visible?: boolean
}


export function PageRenderer(properties: PageRendererProps) {
    const rendererState = useRendererState(properties.handle.id);
    const [title, updateTitle] = useState(rendererState.current().title);

    useEffect(() => {
        loadState();
    }, [properties.handle]);

    function updateText(text: string) {
        const state = rendererState.current();
        const result: RendererState = {
            ...state,
            title: text
        }

        rendererState.update(result);
        updateTitle(text);
    }

    function loadState(){
        updateTitle(rendererState.current().title)
    }

    return (
        <div className="w-full h-full">
            <div>
                <input value={title} type="text" onChange={(e) => updateText(e.currentTarget.value)} />
            </div>
            <p>
                {title}
            </p>
        </div>
    )
}