"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFilter, FaSearch, FaSyncAlt, FaTimes } from "react-icons/fa";

import FilterForm from "./FilterForm";
import Shopsearchform from "./shopsearchform";

interface MediaFilterProps {
  categories: unknown;
  priceRanges: unknown;
}

const MediaFilter = ({
  categories,
  priceRanges,
}: MediaFilterProps) => {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      {/* Floating Filter Button */}

      <button
        type="button"
        onClick={() => setToggle(true)}
        aria-label="Open filters"
        className="
          fixed left-0 top-1/2 z-40
          flex -translate-y-1/2 items-center gap-2
          rounded-r-xl bg-gray-950 px-3 py-4
          text-white shadow-xl
          transition-all duration-300
          hover:bg-amber-600 hover:pr-5
        "
      >
        <FaFilter className="text-sm" />

        <span className="text-xs font-semibold uppercase tracking-wider [writing-mode:vertical-rl]">
          Filter
        </span>
      </button>

      {/* Background Overlay */}

      <div
        onClick={() => setToggle(false)}
        className={`
          fixed inset-0 z-40 bg-black/50
          backdrop-blur-sm
          transition-opacity duration-300
          ${
            toggle
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Filter Drawer */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[350px] max-w-[90vw]
          flex-col overflow-hidden
          bg-[#111111] text-white
          transition-transform duration-500 ease-out
          ${toggle ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Decorative Background */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />

        {/* Header */}

        <div className="relative border-b border-white/10 px-6 pb-5 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20">
                <FaFilter />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-400">
                  Refine
                </p>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Filters
                </h2>
              </div>
            </div>

            {/* Close */}

            <button
              type="button"
              onClick={() => setToggle(false)}
              aria-label="Close filters"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-white/10
                bg-white/5 text-gray-300
                transition-all duration-200
                hover:border-amber-400/30
                hover:bg-amber-500
                hover:text-gray-950
              "
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-400">
            Find exactly what you&apos;re looking for by narrowing down the
            products.
          </p>
        </div>

        {/* Scrollable Content */}

        <div className="relative flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          {/* Search */}

          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              <FaSearch className="text-xs text-amber-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
                Search
              </span>
            </div>

            <div className="rounded-xl bg-white/[0.06] p-1 ring-1 ring-white/10 transition-all focus-within:ring-amber-500/50">
              <Shopsearchform />
            </div>
          </div>

          {/* Divider */}

          <div className="mb-7 h-px bg-gradient-to-r from-amber-500/40 via-white/10 to-transparent" />

          {/* Filters */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
                Filter by
              </span>

              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400">
                Products
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <FilterForm
                categories={categories}
                priceRanges={priceRanges}
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="relative border-t border-white/10 bg-black/20 px-6 py-5">
          <Link
            href="https://nextecommerce-wheat.vercel.app"
            className="
              group flex w-full items-center justify-center gap-2
              rounded-xl border border-white/10
              bg-white/[0.06] px-4 py-3
              text-xs font-medium text-gray-300
              transition-all duration-300
              hover:border-amber-500/30
              hover:bg-amber-500
              hover:text-gray-950
            "
          >
            <FaSyncAlt className="text-xs transition-transform duration-500 group-hover:rotate-180" />

            <span>Reset & refresh shop</span>
          </Link>

          <p className="mt-3 text-center text-[10px] text-gray-500">
            Refine your search to discover more
          </p>
        </div>
      </aside>
    </>
  );
};

export default MediaFilter;