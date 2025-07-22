'use client';
import CartContents from '@/app/reusablecomponent/cartcontent';
import Link from 'next/link';
import { CartItem } from '../types/layouttype';
import { useState } from 'react';


export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  return (
    <div className="mt-20 p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Your Cart</h1>
      <CartContents cartItems={cartItems} setCartItems={setCartItems} />
      
     {cartItems.length ?
        <div className="mt-6 text-center">
          <Link href="/checkout">
            <button className="bg-amber-600 text-white py-2 px-6 rounded hover:bg-amber-700">
              Proceed to Checkout
            </button>
          </Link>
        </div>
        : ''}
    </div>
  );
}
