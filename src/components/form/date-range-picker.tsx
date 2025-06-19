import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

type Props = {
    start: string;
    end: string;
    setStart: (val: string) => void;
    setEnd: (val: string) => void;
};

const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};


export default function DateRangePicker({ start, end, setStart, setEnd }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fp = flatpickr(inputRef.current!, {
            mode: "range",
            dateFormat: "Y-m-d",
            defaultDate: [start, end],
            onChange: (dates: Date[]) => {
                if (dates.length === 2) {
                    setStart(formatDateLocal(dates[0]));
                    setEnd(formatDateLocal(dates[1]));
                }
            }
        });

        return () => fp.destroy();
    }, []);


    return (
        <div className="inline-block">
            <input
                id="daterange"
                ref={inputRef}
                placeholder="YYYY-MM-DD to YYYY-MM-DD"
                className="h-11 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 w-full text-center"
            />
        </div>
    );
}
