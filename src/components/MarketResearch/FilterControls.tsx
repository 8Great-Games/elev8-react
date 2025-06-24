import React from "react";
import { FaGooglePlay, FaAppStoreIos, FaGlobe } from "react-icons/fa";
import DateRangePicker from "../form/date-range-picker";

type FilterControlsProps = {
    start: string;
    end: string;
    setStart: React.Dispatch<React.SetStateAction<string>>;
    setEnd: React.Dispatch<React.SetStateAction<string>>;
    platform: "all" | "android" | "ios";
    setPlatform: React.Dispatch<React.SetStateAction<"all" | "android" | "ios">>;
    rangeOption: "today" | "yesterday" | "7d" | "30d" | "custom";
    setRangeOption: React.Dispatch<
        React.SetStateAction<"today" | "yesterday" | "7d" | "30d" | "custom">
    >;
    onSubmit: () => void;
};

export default function FilterControls({
    start,
    end,
    setStart,
    setEnd,
    platform,
    setPlatform,
    rangeOption,
    setRangeOption,
    onSubmit,
}: FilterControlsProps) {
    const platformOptions = [
        { value: "all", label: "All", icon: <FaGlobe size={14} /> },
        { value: "android", label: "Android", icon: <FaGooglePlay size={14} /> },
        { value: "ios", label: "iOS", icon: <FaAppStoreIos size={14} /> },
    ];

    const rangeOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "7 days", value: "7d" },
        { label: "30 days", value: "30d" },
        { label: "Custom", value: "custom" },
    ];

    return (
        <div className="flex flex-col items-center gap-4 mb-6">
            {/* Platform toggle */}
            <div className="inline-flex bg-gray-100 dark:bg-white/10 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                {platformOptions.map(({ value, label, icon }) => (
                    <button
                        key={value}
                        type="button"
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${platform === value
                                ? "bg-black text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            }`}
                        onClick={() => setPlatform(value as "all" | "android" | "ios")}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>

            {/* Date range options */}
            <div className="flex flex-wrap justify-center gap-[1px] bg-gray-100 dark:bg-white/10 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                {rangeOptions.map(({ label, value }) => (
                    <button
                        key={value}
                        type="button"
                        className={`px-4 py-2 text-sm font-medium transition ${rangeOption === value
                                ? "bg-black text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            }`}
                        onClick={() =>
                            setRangeOption(
                                value as "today" | "yesterday" | "7d" | "30d" | "custom"
                            )
                        }
                    >
                        {label}
                    </button>
                ))}
            </div>


            {/* Custom date picker */}
            {rangeOption === "custom" && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="flex gap-2"
                >
                    <DateRangePicker
                        start={start}
                        end={end}
                        setStart={setStart}
                        setEnd={setEnd}
                    />
                </form>
            )}
        </div>
    );
}
