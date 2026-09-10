'use client';

import { FaSearch } from 'react-icons/fa';

const searchdatatable = ({
  search,
}: {
  search: (query: string) => void;
}) => {
  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-2xl">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => search(e.target.value)}
          className="
            h-14 w-full rounded-2xl
            border border-gray-200
            bg-white
            pl-13 pr-5
            text-sm text-gray-900
            shadow-sm
            outline-none
            transition-all
            placeholder:text-gray-400
            hover:border-gray-300
            focus:border-amber-500
            focus:ring-4 focus:ring-amber-500/10
          "
        />

        <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-400 sm:block">
          Search
        </div>
      </div>
    </div>
  );
};

export default searchdatatable;