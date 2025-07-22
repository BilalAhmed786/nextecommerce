'use client'
import React, { useEffect, useState } from 'react'
import { CartItem } from '../../types/layouttype'
import { SetupCartListener } from '../../helperfunctions/eventlistner'
import { increaseCartQty } from '../../helperfunctions/increaseqty'
import { decreaseQty } from '../../helperfunctions/decreaseqty'
import CartSidebar from '../../reusablecomponent/cartsidebar'


export default function ProductQty({ product }: { product: any }){
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [valid, setValid] = useState('')

  const item = cartItems.find(cart => cart.id === product.id);
  const qty = item ? item.Qty : 1;

  useEffect(() => {
    const cleanup = SetupCartListener(setCartItems);
    return cleanup;
  }, [setCartItems]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className='relative flex flex-col'>

          <div className={`relative -top-10 transition-all duration-600 ease-linear transform ${valid ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
            }`}>
            <button
              className='absolute -top-2 z-50 bg-amber-400 px-1 text-xs rounded-full'
              onClick={() => setValid('')}
            >
              X
            </button>
            <p className='absolute w-[180px] bg-amber-600 p-1 text-white'>{valid}</p>
          </div>

          <div className="absolute top-0 flex gap-3 items-center">
            <button onClick={() => decreaseQty({ id: product.id, cartItems })}>-</button>
            <span>{qty}</span>
            <button onClick={() => increaseCartQty({ id: product.id, cartItems, setValid })}>+</button>
          </div>

        </div>

        {!valid && <CartSidebar />}
      </div>
    </>
  )
}

