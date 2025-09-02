import { useState } from "react";

export default function SeatSlider() {
  const [seats, setSeats] = useState(5); // default seat sayısı

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Select Seats
      </h2>

      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">1</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm">100</span>
      </div>

      <input
        type="range"
        min={1}
        max={100}
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
      />

      <p className="mt-4 text-center text-lg font-medium text-gray-800 dark:text-gray-100">
        {seats} {seats === 1 ? "seat" : "seats"}
      </p>
    </div>
  );
}
