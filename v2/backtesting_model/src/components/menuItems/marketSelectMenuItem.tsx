import { useState, useContext } from "react"
import { MenuItemProps } from "./types"
import { valueToString } from "@/lib/util";
import { MarketInfo, MarketSelectModal } from "@/lib/modals/marketSelectModal";
import { ModalContext } from "@/lib/hooks/useModal";

interface MarketSelectProps extends MenuItemProps<MarketInfo> {
    items: MarketInfo[]
    cancelled?: () => void
}


export function MarketSelectMenuItem(properties: MarketSelectProps) {
    const { updateModal } = useContext(ModalContext);
    const [value, updateValue] = useState(properties.value || properties.items[0]);

    function closeModal() {
        updateModal?.();
        properties.cancelled?.()
    }

    function onValueChanged(value: MarketInfo) {
        updateValue(value);
        closeModal();

        properties.valueChanged?.(value);
    }

    return (
        <div className="h-8 w-full rounded-sm">
            <div className="w-full ">
                <div className="grid grid-cols-2">
                    <label className="my-auto pl-2">{properties.title || "Market"}</label>
                    <button onClick={() => {
                        updateModal?.({
                            backdrop: false,
                            closeOnClickOutside: true,
                            content: <MarketSelectModal
                                onCancel={closeModal}
                                onConfirm={onValueChanged}
                                value={value}
                                items={properties.items} />,
                            title: "Select Market",
                            allowClose: true
                        });
                    }} className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                        <div className="w-full p-2 text-right h-full">
                            <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                {value.symbol}
                            </label>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}