'use client';

import { Range } from "react-range";
import { useState, useEffect } from "react";


export default function FilterForm({ categories, priceRanges }: any) {
  // Default values if priceRanges is empty
  const defaultMin = 0;
  const defaultMax = 5000;

  const [values, setValues] = useState<[number, number]>([defaultMin, defaultMax]);
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  // Parse backend priceRanges on mount
  useEffect(() => {
    if (priceRanges && priceRanges.length > 0) {
      
      const rangeStr = priceRanges[0].amount; // e.g. "2000 - 3000"
      const [minPrice, maxPrice] = rangeStr.split(" - ").map(Number);
      setValues([minPrice, maxPrice]);
      setMin(minPrice);
      setMax(maxPrice);
    }
  }, [priceRanges]);

  const step = 100;

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
          step={step}
          min={min}
          max={max}
          onChange={(vals) => setValues(vals as [number, number])}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-1 bg-gray-200 rounded w-full">
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