import { useState, useContext, useEffect } from "react"
import { ListItemValue, ListSelectModal } from "@/lib/modals/listSelectModal";
import { ModalContext } from "@/lib/hooks/useModal";


export interface MenuItemProps<T> {
    title: string,
    value: T,
    valueChanged?: (value: T) => void;
    cancelled?: () => void
}

interface MenuSelectProps<T extends ListItemValue> extends MenuItemProps<T> {
    items: T[]
}

export function ListSelectMenuItem<T extends ListItemValue>(properties: MenuSelectProps<T>) {
    const { updateModal } = useContext(ModalContext);
    // const [value, updateValue] = useState(properties.value || properties.items[0]);

    // useEffect(() => {
    //     // updateValue(properties.items[0])
    //     // properties.valueChanged?.(properties.items[0])
    // }, [properties.value, properties.items])

    function closeModal() {
        updateModal?.();
        properties.cancelled?.()
    }

    function onValueChanged(value: T) {
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
                            backdrop: true,
                            closeOnClickOutside: true,
                            content: <ListSelectModal
                                onCancel={closeModal}
                                onConfirm={onValueChanged}
                                value={properties.value!}
                                items={properties.items} />,
                            title: "Select Market",
                            allowClose: true
                        });
                    }} className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                        <div className="w-full p-2 text-right h-full">
                            <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                {properties.value?.title() || "Loading..."}
                            </label>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}