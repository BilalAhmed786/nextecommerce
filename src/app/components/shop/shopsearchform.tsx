'use client'
import React, { useState } from 'react'

const shopsearchform = () => {

  return (
    <div className="mb-5 mt-5 w-full">
      <form method="get">
        <div className="flex w-full">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="border px-4 py-2 rounded-l-2xl w-full outline-0"
          />
          <button
            type="submit"
            className="text-white bg-amber-500 px-4 py-2 rounded-r-2xl"
          >
            Search
          </button>
        </div>
      </form>
    </div>

  )
}

export default shopsearchform