"use client";

import { Range } from "react-range";
import { useState } from "react";

const MIN = 0;
const MAX = 5000;
const STEP = 100;

export default function FilterForm({ categories }: any) {
  const [values, setValues] = useState<[number, number]>([2000, 3000]);

  return (
    <form method="get" className="flex flex-col gap-6">

      {/* CATEGORY */}
      <div>
        <h2 className="font-semibold mb-2">Category</h2>
        {categories?.map((cat: any) => (
          <label key={cat.id} className="flex items-center gap-2 mb-1">
            <input type="radio" name="category" value={cat.id} />
            {cat.name}
          </label>
        ))}
      </div>

      {/* PRICE RANGE */}
      <div>
        <h2 className="font-semibold mb-2">Price Range</h2>

        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={(vals) => setValues(vals as [number, number])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-1 bg-gray-200 rounded w-full"
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props} 
              className="h-3 w-3 bg-amber-500 rounded-full shadow cursor-pointer"
            />
          )}
        />

        <div className="flex justify-between text-xs mt-2">
          <span>${values[0]}</span>
          <span>${values[1]}</span>
        </div>

        {/* Format same as API expects */}
        <input
          type="hidden"
          name="price"
          value={`${values[0]}+-+${values[1]}`}
        />
      </div>

      <button
        type="submit"
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-700"
      >
        Apply Filters
      </button>
    </form>
  );
}