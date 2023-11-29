import { ParentComponentProperties } from "@/app/types";

interface MenuItemSectionProps extends ParentComponentProperties {
    keyLabel: string,
    valueLabel: string,
    removeMargin?: boolean
}

export function MenuItemSection(properties: MenuItemSectionProps) {
    const removeTopMargin = properties.removeMargin;
    
    return (
        <div className={`${removeTopMargin ? "" : "mt-10" }`}>
            <div>
                <div className="w-full px-2 grid-cols-2 grid h-6 dark:border-zinc-700 border-zinc-300 border-b">
                    <div className=" py-0.5 h-6  text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                        {properties.keyLabel}
                    </div>
                    <div className=" h-6 py-0.5 text-right text-zinc-400 font-semibold dark:text-zinc-600 dark:border-zinc-700 border-zinc-300">
                        {properties.valueLabel}
                    </div>
                </div>
            </div>
            {properties.children}
        </div>
    )
}