import { PropsWithChildren, WheelEvent } from "react";

export function ScrollBlocker({ children }: PropsWithChildren) {
    const enableScroll = () => {
        document.removeEventListener('wheel', (e) => {
            e.preventDefault();
        }, false)
    }

    const disableScroll = () => {
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false })
    }

    const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
        if (event.deltaY > 0) {
            //   this.decreaseValue()
        } else {
            //   this.increaseValue()
        }
    }

    return (
        <div onWheel={handleScroll} onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
            {children}
        </div>
    )
}