import React, { useMemo, useState, useRef } from "react";
import { toolHost } from "../../api/axios";

// Default export so the canvas can render it
export default function PricingSliderSection() {
    // value represents thousands (e.g., 10 => 10k)
    const [value, setValue] = useState<number>(10);
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

    const formatted = useMemo(() => formatVisitors(value), [value]);

    // Price per seat logic
    const pricePerSeat = billing === "monthly" ? 49 : 399;
    const price = `$${value * pricePerSeat}`;

    const min = 1;
    const max = 10;
    const step = 1;

    // Converts value to percentage for positioning
    const toPct = (val: number) => ((val - min) / (max - min)) * 100;

    const marks = Array.from({ length: max }, (_, i) => ({
        v: i + 1,
        label: `${i + 1}`,
    }));

    // ref to the slider track container so we can compute positions for dragging
    const sliderRef = useRef<HTMLDivElement | null>(null);

    // Moves knob to a clientX position (mouse or touch)
    const handleMove = (clientX: number | undefined) => {
        if (!sliderRef.current || clientX === undefined) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const newVal = Math.round(pct * (max - min) + min);
        setValue(newVal);
    };

    // Mouse / touch handlers attached when user starts interacting with the knob
    const onKnobMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const move = (ev: MouseEvent) => handleMove(ev.clientX);
        const up = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    };

    const onKnobTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        const move = (ev: TouchEvent) => {
            if (ev.touches && ev.touches[0]) handleMove(ev.touches[0].clientX);
        };
        const end = () => {
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', end);
        };
    document.addEventListener('touchmove', move, { passive: false } as AddEventListenerOptions);
        document.addEventListener('touchend', end);
    };

    // Purchase handler: navigate to toolHost/signup or fallback to origin
    const handlePurchase = () => {
        const host = toolHost || window.location.origin;
        window.location.href = `${host}/signup`;
    };

    return (
        <div className="w-full bg-brand-950 text-white antialiased">
            {/* Top spacing */}
            <div className="mx-auto max-w-5xl px-4 pt-14 pb-10">
                {/* Helper bubble */}
                <div className="relative mb-6 flex justify-center">
                    <div className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold shadow-lg">
                        Select your number of seats
                        <span className="absolute left-1/2 top-full -ml-2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-brand-500 rotate-180" />
                    </div>
                </div>

                {/* Slider */}
                <div
                    ref={sliderRef}
                    onClick={(e) => handleMove((e as React.MouseEvent).clientX)}
                    className="relative mx-auto max-w-4xl"
                >
                    {/* Slider input (invisible, but handles interaction) */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value, 10))}
                        className="range-slider w-full appearance-none bg-transparent focus:outline-none"
                    />

                    {/* Custom track */}
                    <div className="pointer-events-none absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-brand-200/60" />
                    {/* Progress */}
                    <div
                        className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-400"
                        style={{ width: `${toPct(value)}%` }}
                    />
                    {/* Knob (draggable) */}
                    <div
                        role="slider"
                        aria-valuemin={min}
                        aria-valuemax={max}
                        aria-valuenow={value}
                        onMouseDown={onKnobMouseDown}
                        onTouchStart={onKnobTouchStart}
                        className="absolute top-1/2 h-8 w-8 -translate-y-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-brand-400 shadow-[0_6px_20px_rgba(255,50,250,0.6)] cursor-grab active:cursor-grabbing"
                        style={{ left: `${toPct(value)}%` }}
                    />

                    {/* Marks */}
                    <div className="relative mt-10 flex w-full">
                        {marks.map((m) => (
                            <span
                                key={m.v}
                                className="absolute text-sm text-slate-100 cursor-pointer select-none"
                                style={{
                                    left: `${toPct(m.v)}%`,
                                    transform: "translateX(-50%)",
                                    fontSize: m.v === value ? "1rem" : "0.9rem",
                                }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing card area */}
            <div className="rounded-t-[48px] bg-white/95 py-16 text-slate-800 backdrop-blur">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
                    {/* Tabs + Card */}
                    <div className="col-span-1 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
                        {/* Billing toggle */}
                        <div className="mb-6 inline-flex rounded-xl bg-slate-100 p-1 text-sm font-semibold">
                            <button
                                onClick={() => setBilling("annual")}
                                className={`rounded-lg px-4 py-2 ${billing === "annual" ? "bg-white shadow" : "text-slate-500"
                                    }`}
                            >
                                Annual
                            </button>
                            <button
                                onClick={() => setBilling("monthly")}
                                className={`rounded-lg px-4 py-2 ${billing === "monthly" ? "bg-white shadow" : "text-slate-500"
                                    }`}
                            >
                                Monthly
                            </button>
                        </div>

                        <h2 className="text-3xl font-extrabold text-slate-900">Pro Monthly</h2>
                        <p className="mt-2 max-w-md text-slate-500">
                            Show social proof notifications to increase leads and sales.
                        </p>


                        <div className="mt-8 flex items-end gap-2">
                            <span className="text-5xl font-extrabold text-slate-900">{price}</span>
                            <span className="mb-2 text-slate-500">
                                {billing === "monthly" ? "monthly per seat ($49/seat)" : "yearly per seat ($399/seat)"}
                            </span>
                        </div>

                        <button onClick={handlePurchase} className="mt-8 w-full rounded-2xl bg-[#3b82f6] px-5 py-3 text-white shadow hover:bg-[#2563eb]">
                            Purchase Now
                        </button>
                    </div>

                    {/* Features */}
                    <div className="col-span-1 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Pro plans includes:</h3>
                        <ul className="space-y-4 text-slate-700">
                            {[
                                `${formatted.split(" ")[0]} unique visitors`,
                                "Unlimited domains",
                                "Unlimited notifications",
                                "A/B testing",
                                "Conversion analytics",
                                "Live chat support",
                                "Recent Activity notification",
                                "Live Visitor Count notification",
                            ].map((t) => (
                                <li key={t} className="flex items-start gap-3">
                                    <CheckIcon className="mt-0.5 h-5 w-5 flex-none" />
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Styles for the native input (kept invisible) */}
            <style>{`
        input[type=range].range-slider { height: 32px; }
        input[type=range].range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 32px; width: 32px; background: transparent; cursor: pointer; }
        input[type=range].range-slider::-moz-range-thumb { height: 32px; width: 32px; background: transparent; cursor: pointer; border: none; }
        input[type=range].range-slider::-ms-thumb { height: 32px; width: 32px; background: transparent; cursor: pointer; border: none; }
        input[type=range].range-slider::-webkit-slider-runnable-track { -webkit-appearance: none; height: 0px; background: transparent; }
        input[type=range].range-slider::-moz-range-track { height: 0px; background: transparent; }
      `}</style>
        </div>
    );
}

function formatVisitors(v: number) {
    // v is in thousands
    if (v < 1000) return `${v * 1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${v}k`;
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" className="text-emerald-500" stroke="currentColor" fill="none" />
            <path d="M8 12.5l2.5 2.5L16 9" className="text-emerald-500" stroke="currentColor" />
        </svg>
    );
}
