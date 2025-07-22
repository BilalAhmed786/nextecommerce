'use client';
import { addtocart } from "../helperfunctions/addtocart";
export default function Shopbutton({ product }: { product: any }) {

  return (
  
  <div className="">

      <button
        type="button"
        className="bg-amber-600 px-3 py-1 text-sm text-white cursor-pointer animate-bounce"
        onClick={()=>addtocart(product)}
      >

        Add to cart
      </button>
    </div>


  )
}

