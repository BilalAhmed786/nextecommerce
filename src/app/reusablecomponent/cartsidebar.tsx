'use client';
import { useEffect, useState } from "react";
import CartContents from "./cartcontent";
import Link from "next/link";
import { CartItem } from '../types/layouttype';
export default function CartSidebar() {
   const [toggle, setToggle] = useState(false);
   const [cartItems, setCartItems] = useState<CartItem[]>([]);
   
  useEffect(() => {
    const handleListener = () => {
     
      setToggle(true);
    
    };

    window.addEventListener('cartChanged', handleListener);
    return () => window.removeEventListener('cartChanged', handleListener);
  }, []);

  return (
    
    <div>
   
      {toggle && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          
        />
      )}
      
      <div
        className={`
          fixed top-0 right-0 h-full w-[80%] sm:w-[50%] lg:w-[40%] z-50 transform bg-linear-to-t from-amber-600 to-amber-700 text-white
          ${toggle ? 'translate-x-0' : 'translate-x-full'}
          transition-transform duration-700 ease-in-out overflow-y-auto overflow-x-hidden
        `}
      >
          
        <div className="p-1">
          <button
            className="text-xs font-bold text-white border px-1 rounded-full 
               transition-transform duration-500 ease-in-out hover:rotate-180"
            onClick={() => setToggle(false)}
          >
            ×
          </button>
        </div>
      
         <CartContents  setCartItems={setCartItems} cartItems={cartItems}/>
        
        {cartItems.length?
        <div className="flex justify-center gap-2 m-5">
          <Link href={'/cart'} className="w-[40%] bg-amber-700 text-center text-white py-2 rounded hover:bg-amber-800 transition">
            View Cart
          </Link>
          <Link href={'/checkout'} className="w-[40%] bg-amber-700 text-center text-white py-2 rounded hover:bg-amber-800 transition">
            Checkout
          </Link>
        </div>
         : <div className="flex justify-center"><Link href={'/'} className="w-[40%] bg-amber-600 text-center text-white py-2 rounded hover:bg-amber-700 transition">Back to Shop</Link></div> }
      </div>

    </div>
   
    
  );
}
