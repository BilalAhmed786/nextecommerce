'use client'
import React, { useState } from 'react'

const shopsearchform = () => {
const [data,search] = useState()
  return (
    <div>
   <form method="get" className="">
          <input
            type="text"
            name="search"
            placeholder="Search product name"
            className="border px-4 py-2 rounded-2xl w-[80%]"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white ml-3 px-4 py-2 rounded-2xl hover:bg-blue-700"
          >
            Search
          </button>
        </form>

    </div>
  )
}

export default shopsearchform