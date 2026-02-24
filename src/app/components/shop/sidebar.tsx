'use client'
import Link from "next/link"
import FilterForm from "./FilterForm"
import Shopsearchform from "./shopsearchform"
import { useState } from "react"
import { FaSyncAlt } from 'react-icons/fa'  
const mediafilter = ({ categories, priceRanges }: any) => {
  const [toggle, settoggle] = useState(false)
  return (
    <div className="overflow-auto">
      <button
        onClick={() => settoggle(true)}
        className="fixed -left-1 text-sm bg-amber-600 px-2 py-1 text-white rotate-90 animate-bounce z-50"
      >
        Filter
      </button>
      
        <aside
          className={`fixed w-[350px] bg-linear-to-t from-amber-600 to-amber-700 text-white transition-transform duration-500 ease-in-out transform
      ${toggle ? 'translate-x-0' : '-translate-x-full'} p-10 block h-screen top-0 left-0 z-50`}
        >
          <button className="absolute lg:right-2 md:right-2 right-16 border-1 top-2 rounded-full px-1 text-xs" onClick={() => settoggle(false)}>X</button>
          <Link className="absolute top-2 right-10  mb-5 underline text-white" href={`${process.env.NEXT_PUBLIC_URL}`}>
          <FaSyncAlt/>
          </Link>
          <Shopsearchform/>
          <FilterForm categories={categories} priceRanges={priceRanges} />

        </aside>
      </div>
     

    

  )
}

export default mediafilter