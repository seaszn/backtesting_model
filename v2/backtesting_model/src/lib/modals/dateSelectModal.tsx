import { IconButton } from "@/components/iconButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from 'react'

const MONTHS = ['January', "Februari", 'March', "April", "May", "June", 'July', "August", 'September', "October", "November", "December"]
const WEEK_DAYS = ['Mon', "Tue", 'Wen', "Thu", "Fri", "Sat", "Sun"]
const UNIX_DAY = 86400000

enum Mode {
    Month = 0,
    Year = 1,
    Decade = 2
}

function getNumericArray(length: number) {
    let result: number[] = []
    for (var i = 0; i < length; i++) {
        result.push(i);
    }

    return result;
}

interface DateSelectProps {
    minDate: Date,
    maxDate?: Date
}

function today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function DateSelectModal(properties: DateSelectProps) {
    const minDate = properties.minDate;
    const maxDate = properties.maxDate || today()

    const [mode, setMode] = useState(Mode.Month);
    const [visibleMonth, setVisibleMonth] = useState(maxDate.getMonth())
    const [visibleYear, setVisibleYear] = useState(maxDate.getFullYear())
    const [selected, setSelected] = useState(maxDate);

    function selectNextMode() {
        if (mode == Mode.Decade) {
            setMode(Mode.Month)
        }
        else {
            setMode(mode + 1)
        }
    }

    function getDecadeYears() {
        const decadeStartYear = visibleYear - (visibleYear % 20);

        return getNumericArray(20).map(x => {
            return decadeStartYear + x;
        })
    }

    function getModeButtonContent() {
        const decadeYears = getDecadeYears()
        switch (mode) {
            case Mode.Month: return `${MONTHS[visibleMonth]} ${visibleYear}`
            case Mode.Year: return `${visibleYear}`
            case Mode.Decade: return `${decadeYears[0]} - ${decadeYears.slice(-1)}`;
        }
    }

    function previousClicked() {
        if (previousEnabled()) {
            if (mode == Mode.Month) {
                if (visibleMonth > 0) {
                    setVisibleMonth(visibleMonth - 1)
                }
                else {
                    setVisibleMonth(11)
                    setVisibleYear(visibleYear - 1)
                }
            }
            else if (mode == Mode.Year) {
                setVisibleYear(visibleYear - 1)
            }
            else {
                setVisibleYear(visibleYear - 20)
            }
        }
    }

    function previousEnabled() {
        if (mode == Mode.Month) {
            return visibleYear > minDate.getFullYear() || visibleMonth > minDate.getMonth()
        }
        else if (mode == Mode.Year) {
            return visibleYear > minDate.getFullYear();
        }
        else {
            return ((visibleYear - (visibleYear % 20))) > minDate.getFullYear();
        }
    }

    function nextClicked() {
        if (nextEnabled()) {
            if (mode == Mode.Month) {
                if (visibleMonth < 11) {
                    setVisibleMonth(visibleMonth + 1)
                }
                else {
                    setVisibleMonth(0)
                    setVisibleYear(visibleYear + 1)
                }
            }
            else if (mode == Mode.Year) {
                setVisibleYear(visibleYear + 1)
            }
            else {
                setVisibleYear(visibleYear + 20)
            }
        }
    }

    function nextEnabled() {
        if (mode == Mode.Month) {
            return visibleYear < maxDate.getFullYear() || visibleMonth < maxDate.getMonth()
        }
        else if (mode == Mode.Year) {
            return visibleYear < maxDate.getFullYear();

        }
        else {
            return ((visibleYear - (visibleYear % 20)) + 20) < maxDate.getFullYear();
        }
    }

    function getHeaderLabels() {
        switch (mode) {
            case Mode.Month:
                return <div className="grid w-full gap-1 grid-cols-7 p-1 bg-zinc-700 rounded-md mt-4" style={{ gridTemplateColumns: '2rem 2rem 2rem 2rem 2rem 2rem 2rem' }}>
                    {
                        WEEK_DAYS.map(x => {
                            return (
                                <div className="mx-auto">{x}</div>
                            )
                        })
                    }
                </div>
            case Mode.Year: return <div className="p-1 w-full mx-auto justify-center flex bg-zinc-700 rounded-md mt-4">Months</div>
            case Mode.Decade: return <div className="p-1 w-full mx-auto justify-center flex bg-zinc-700 rounded-md mt-4">Years</div>
        }
    }

    function getCalendarButtons() {
        if (mode == Mode.Month) {
            return getDayButtons();
        }
        else if (mode == Mode.Year) {
            return getMonthButtons();
        }
        else {
            return getYearButtons()
        }
    }

    function getYearButtons() {
        const years = getDecadeYears();

        return (
            <div className="grid w-full h-56 gap-1 grid-cols-7 grid-rows-6 p-1 rounded-md mt-4" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                {
                    years.map((value) => {
                        const enabled = value <= maxDate.getFullYear() && value >= minDate.getFullYear();
                        const selectedYear = selected.getFullYear() == value;

                        return (
                            <button onClick={() => {
                                if (enabled) {
                                    setVisibleYear(value);
                                    setMode(Mode.Year)
                                }
                            }} className={`font-semibold border-zinc-300 dark:border-zinc-700 items-center w-full h-full cursor-default rounded-md flex justify-center ${enabled ? 'hover:bg-zinc-300 dark:hover:bg-zinc-700' : 'text-zinc-400'} ${selectedYear ? "border-1" : "border-none"}`}>
                                {value}
                            </button>
                        )

                    })
                }
            </div>
        )
    }

    function getMonthButtons() {
        const months = MONTHS.map(x => {
            return x.slice(0, 3);
        })
        return (
            <div className="grid w-full h-56 gap-1 grid-cols-7 grid-rows-6 p-1 rounded-md mt-4" style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr 1fr' }}>
                {
                    months.map((value, index) => {
                        const enabled = !(visibleYear > maxDate.getFullYear() || visibleYear == maxDate.getFullYear() && index > maxDate.getMonth())
                        const selectedMonth = selected.getMonth() == index && visibleYear == selected.getFullYear();

                        return (
                            <button onClick={() => {
                                if (enabled) {
                                    setVisibleMonth(index);
                                    setMode(Mode.Month)
                                }
                            }} className={`font-semibold border-zinc-300 dark:border-zinc-700 items-center w-full h-full cursor-default rounded-md flex justify-center ${enabled ? 'hover:bg-zinc-300 dark:hover:bg-zinc-700' : 'text-zinc-400'} ${selectedMonth ? "border-1" : "border-none"}`}>
                                {value}
                            </button>
                        )

                    })
                }
            </div>
        )
    }

    function getDayButtons() {
        var date = new Date(visibleYear, visibleMonth, 1);
        var days: Date[] = [];

        while (date.getMonth() === visibleMonth) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return (
            <div className="grid gap-1 grid-cols-7 grid-rows-6 p-1 rounded-md mt-4" style={{ gridTemplateColumns: '2rem 2rem 2rem 2rem 2rem 2rem 2rem', gridTemplateRows: '2rem 2rem 2rem 2rem 2rem 2rem' }}>
                {
                    getNumericArray(days[0].getDay()).map(x => {
                        return <div className="w-10 h-10" />
                    })
                }
                {
                    days.map((x) => {
                        const enabled = x.valueOf() <= maxDate.valueOf();

                        return (
                            <button onClick={() => {
                                if(enabled){
                                    setSelected(x);
                                }
                            }} className={`font-semibold  items-center w-full h-full cursor-default rounded-md flex justify-center ${enabled ? 'hover:bg-zinc-300 dark:hover:bg-zinc-700' : 'text-zinc-400'} ${selected.valueOf() == x.valueOf() ? "border-1 underline" : "border-none"}`}>
                                {x.getDate()}
                            </button>
                        )

                    })
                }
            </div>
        )
    }

    return (
        <div className="grow flex flex-col">
            {/* <div className="relative border-b w-full overflow-hidden border-zinc-300 dark:border-zinc-700 h-full min-w-0 border-collapse outline-none bg-zinc-200 border-1 rounded-md text-left dark:bg-zinc-800  hover:bg-zinc-300  dark:hover:bg-zinc-700">
                <input value={inputValue} onChange={(e) => {
                    const input = e.currentTarget.value.replace("-", "");
                    const currentValue = inputValue.replace("-", "");
                    const lastChar = input[input.length - 1];

                    const validatedValue = (() => {
                        if (input.length < inputValue.length) {
                            return currentValue.slice(0, currentValue.length - 1)
                        }
                        else {
                            if (isNumeric(lastChar)) {
                                return input;
                            }
                        }

                        return currentValue;
                    })();

                    setInputValue(validatedValue.slice(0, 8))
                }} placeholder="yyyy-mm-dd" type="text" className=" outline-none bg-none bg-transparent focus:dark:bg-zinc-700 focus:bg-zinc-300 p-2 w-full h-full " />
                <Calendar strokeWidth={"1px"} className="absolute top-0 bottom-0 right-1 my-auto" />
            </div> */}
            {/* <Divider className="mt-4" /> */}
            <div className="grow flex flex-col">
                <div className="flex gap-1 h-8 w-full justify-between">
                    <IconButton disabled={!previousEnabled()} onClick={previousClicked} icon={<ChevronLeft />} />
                    <button onClick={selectNextMode} className="hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc  text-lg font-semibold grow mx-4 rounded-md">
                        {getModeButtonContent()}
                    </button>
                    <IconButton onClick={nextClicked} disabled={!nextEnabled()} icon={<ChevronRight />} />
                </div>
                {
                    getHeaderLabels()
                }
                <div className="h-full flex">
                    {
                        getCalendarButtons()
                    }
                </div>
            </div>

            <div className="w-full border-t border-zinc-300 dark:border-zinc-700 h-12 pt-4 mt-4 mb-2 gap-1 flex justify-end">
                <button className="p-2 hover:bg-zinc-300 border-1 dark:hover:bg-zinc-700 rounded-md font-semibold  text-sm px-4">Cancel</button>
                <button className="p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-md font-semibold  text-sm px-4">Select</button>
            </div>
        </div>
    )
}