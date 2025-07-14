'use client'
import React, { useState } from 'react'

const shopsearchform = () => {

  return (
    <div className='mb-5 mt-5 w-full'>
      <form method="get" className="">
        <div className='flex w-full'>
          <input
            type="text"
            name="search"
            placeholder="Search product name"
            className="border px-4 py-2 rounded-2xl w-[100%] md:w-[100%] lg:w-[80%]"
          />
          <button
            type="submit"
            className="lg:bg-blue-600 md:text-black text-black lg:text-white ml-3 lg:px-4 lg:py-2 lg:rounded-2xl hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

    </div>
  )
}

export default shopsearchform