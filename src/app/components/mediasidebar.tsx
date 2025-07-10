'use client'
import Link from "next/link"
import FilterForm from "./FilterForm"
import Shopsearchform from "./shopsearchform"
import { useState } from "react"
import { FaSyncAlt } from 'react-icons/fa'  
const mediafilter = ({ categories, priceRanges }: any) => {
  const [toggle, settoggle] = useState(false)
  return (
    <div className="lg:hidden overflow-auto">
      <button
        onClick={() => settoggle(true)}
        className="fixed -left-1 text-sm bg-blue-600 px-2 py-1 text-white rotate-90"
      >
        Filter
      </button>
      
        <aside
          className={`fixed bg-white transition-transform duration-500 ease-in-out transform
      ${toggle ? 'translate-x-0' : '-translate-x-full'} p-10 block lg:hidden h-screen top-0 left-0 z-50`}
        >
          <button className="absolute right-2 border-1 rounded-full px-1 text-xs" onClick={() => settoggle(false)}>X</button>
          <Link className="block mb-5 underline text-blue-500" href={'http://localhost:3000'}>
          <FaSyncAlt/>
          </Link>
          <Shopsearchform/>
          <FilterForm categories={categories} priceRanges={priceRanges} />

        </aside>
      </div>
     

    

  )
}

export default mediafilter