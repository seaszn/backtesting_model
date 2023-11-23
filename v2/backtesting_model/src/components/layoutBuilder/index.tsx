import { ParentComponentProperties } from "@/app/types";
import { useState, useRef, useEffect } from 'react'

import { ResizableBox } from "react-resizable";

interface GridPosition {
    x: number,
    y: number
}

interface GridSize {
    width: number,
    height: number
}


export function LayoutBuilder() {
    const containerReference = useRef<any>()
    const [mouseGridPosition, updateMouseGridPosition] = useState<GridPosition | undefined>()
    const gridSize: GridSize = { width: 10, height: 24 }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
        });
        resizeObserver.observe(containerReference.current);

        window.addEventListener('mousemove', onMouseMove);
        return (() => window.removeEventListener('mousemove', onMouseMove))
    }, [])

    function onMouseMove(ev: MouseEvent) {
        if (ev.target == containerReference.current) {
            // snap mouse position to grid
        }
        else {

        }
    }

    // function onClick() {
    //     setState({ width: 200, height: 200 });
    // };

    // function onResize(event: any, { element, size }: { element: any, size: any }) {
    //     setState({ width: size.width, height: size.height });
    // };

    return (
        <div ref={containerReference} className="w-full min-h-screen flex">
            <div className="bg-yellow-400 grow grid gridcols" style={{ gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${gridSize.height}, minmax(0, 1fr))` }}>
                <div className="w-full h-full bg-green-400">
                    
                </div>
            </div>
        </div>
    )
}