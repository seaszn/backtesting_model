import React, { useState } from 'react'
import { MenuItemProps } from './types';

export function CheckboxMenuItem(properties: MenuItemProps<boolean>) {
    const [value, updateValue] = useState(properties.value)


    function onValueChanged(value: boolean) {
        updateValue(value);
        properties.valueChanged?.(value);
    }

    return (
        <div className="h-8 w-full rounded-sm">
            <div className="w-full">
                <div className="grid grid-cols-2">
                    <label className="my-auto pl-2">{properties.title || "Checked"}</label>
                    <div className="border-b h-8 overflow-hidden rounded-sm  border-zinc-300 dark:border-zinc-700 ">
                        <div className="w-full p-2 text-right h-full">
                            <input type='checkbox' readOnly checked={value} onClick={() => onValueChanged(!value)} className="w-8 h-8 rounded-sm checked:bg-blue-600 bg-zinc-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}