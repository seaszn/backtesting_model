
// Given an offset index of 1 due to errors in switch case
export enum Evaluation {
    Good = 1,
    Medium = 2,
    Bad = 3
}

export interface StatisticValueProps<T extends number> {
    name: string;
    value: T;
    evaluate?: (value: T) => Evaluation;
}

export function StatisticValue<T extends number>(props: StatisticValueProps<T>) {
    function getBorderClass() {
        let result = props.evaluate?.(props.value);

        if (result) {
            switch (result) {
                case Evaluation.Medium: return 'border-amber-500';
                case Evaluation.Good: return 'border-green-500';
                case Evaluation.Bad: return 'border-rose-500';
            }
        }

        return 'border-neutral-700'
    }

    return (
        <div className={`w-full h-7 mt-4 flex flex-row-reverse gap-2 pt-0.5 overflow-hidden overflow-ellipsis border-b ${getBorderClass()}`}>
            <div className=' grow h-full overflow-hidden justify-between flex text-neutral-300 overflow-ellipsis w-full shrink'>
                <label className='text-xs my-auto shrink-0 mr-4 '>{props.name}</label>
                <label className='text-xs my-auto shrink-0 text-neutral-300'>{props.value}</label>
            </div>
        </div>
    )
}
