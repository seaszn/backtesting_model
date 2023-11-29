import React, { useState } from 'react'
import { FUNC_VALUES, FuncValue, FuncValueDropdown } from "../funcValueDropdown";

interface DatePickerMenuItemProps {
    title?: string,
    value?: FuncValue,
    valueChanged?: (value: FuncValue) => void;
}

export function FuncValueMenuItem(properties: DatePickerMenuItemProps) {
    const [value, updateValue] = useState(properties.value || FUNC_VALUES[0])


    function onValueChanged(value: FuncValue) {
        updateValue(value);
        properties.valueChanged?.(value);
    }

    return (
        <div className="h-8 w-full rounded-sm">
        <div className="w-full">
            <div className="grid grid-cols-2">
                <label className="my-auto pl-2">{properties.title}</label>
                <FuncValueDropdown value={value} onValueChanged={(e) => onValueChanged(e)} />
            </div>
        </div>
    </div>
    )
}