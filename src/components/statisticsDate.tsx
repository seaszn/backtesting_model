
export interface StatisticDateProps {
    name: string;
    value: string;
    suffix?: string,
}

export function StatisticDate(props: StatisticDateProps) {
    return (
        <div className={`w-full h-7 mt-4 flex flex-row-reverse gap-2 pt-0.5 overflow-hidden overflow-ellipsis border-b border-neutral-700`}>
            <div className=' grow h-full overflow-hidden justify-between flex text-neutral-300 overflow-ellipsis w-full shrink'>
                <label className='text-xs my-auto shrink-0 mr-4 '>{props.name}</label>
                <label className='text-xs my-auto shrink-0 text-neutral-300'>{`${props.value}${props.suffix || ''}`}</label>
            </div>
        </div>
    )
}
