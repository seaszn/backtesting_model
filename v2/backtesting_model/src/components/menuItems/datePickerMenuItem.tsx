import { ModalContext } from "@/lib/hooks/useModal";
import { DateSelectModal } from "@/lib/modals/dateSelectModal";
import React, { useContext, useState } from 'react'
import { MenuItemProps } from "./types";

interface DatePickerProps extends MenuItemProps<Date> {
    minDate: Date
    maxDate?: Date,
    onCancelled?: () => void;
}

function today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}


export function DatePickerMenuItem(properties: DatePickerProps) {
    const { updateModal } = useContext(ModalContext);
    const [value, updateValue] = useState(properties.value || today())

    const maxDate = properties.maxDate || today()

    function closeModal() {
        updateModal?.();
        properties.onCancelled?.()
    }

    function onValueChanged(value: Date) {
        updateValue(value);
        properties.valueChanged?.(value);

        updateModal?.();
    }

    return (
        <div className="h-8 w-full rounded-sm">
            <div className="w-full ">
                <div className="grid grid-cols-2">
                    <label className="my-auto pl-2">{properties.title || "Select Date"}</label>
                    <button onClick={() => {
                        updateModal?.({
                            backdrop: false,
                            closeOnClickOutside: true,
                            content: <DateSelectModal onCancel={closeModal} onConfirm={onValueChanged} value={value} maxDate={maxDate} minDate={properties.minDate} />,
                            title: properties.title || "Select Date",
                            allowClose: true
                        });
                    }} className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                        <div className="w-full p-2 text-right h-full">
                            <label className=" border-zinc-300 dark:border-zinc-700 hover:bg-zinc-300 py-2 dark:hover:bg-zinc-700  font-semibold text-right">
                                {`${value.getMonth() + 1}-${value.getDate()}-${value.getFullYear()}`}
                            </label>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}