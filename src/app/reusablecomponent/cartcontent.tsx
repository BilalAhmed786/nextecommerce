'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CartItem } from '../types/layouttype';
import { usePathname } from 'next/navigation';
import Cartnotification from './cartnotification';
import { increaseCartQty } from '../helperfunctions/increaseqty';
import { decreaseQty } from '../helperfunctions/decreaseqty';
import { SetupCartListener } from '../helperfunctions/eventlistner';
import { removeitem } from '../helperfunctions/removeitem';

export interface Props {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartContents({ setCartItems, cartItems }: Props) {

  const pathname = usePathname();
  const pathSegments = pathname?.split('/');
  const lastSegment = pathSegments?.pop() || pathSegments?.pop()
  const [valid, setValid] = useState('')


useEffect(() => {
    const cleanup = SetupCartListener(setCartItems);
     return cleanup;
  }, [setCartItems]);


  const grandTotal = cartItems?.reduce((sum, item) => sum + item.total, 0);

  return (

    <div>
      <div className="w-full p-4">
        {cartItems.length === 0 ? (
          <p className={`text-center ${lastSegment === 'cart' ? 'text-gray-500' : 'text-white'}`}>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center border-b pb-3 p-2">
                <Image 
                src={item.image} 
                alt={item.name} 
                width={50} 
                height={50}
                className="rounded" 
                unoptimized={true}
                
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className={`text-xs ${lastSegment === 'cart' ? 'text-black' : 'text-white'}`}>${item.price}</p>


                  <div className="flex items-center gap-2 mt-1 z-50">
                    <button
                      onClick={() => decreaseQty({id:item.id,cartItems})}
                      className="px-2 py-0.5 bg-amber-500 rounded text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm">{item.Qty}</span>
                    <button
                      onClick={() => increaseCartQty({id:item.id,cartItems,setValid})}
                      className="px-2 py-0.5 bg-amber-500 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-sm">${item.total}</p>
                  <button
                    onClick={() => removeitem({id:item.id,cartItems})}
                    className={`${lastSegment === 'cart' ? 'text-red-500' : 'text-white'} text-xs hover:underline mt-1`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <p className="text-right font-semibold text-lg pt-2">
              Total: ${grandTotal}
            </p>
          </>
        )}

      </div>

      <Cartnotification valid={valid} setValid={setValid} />
    </div>

  );
}
