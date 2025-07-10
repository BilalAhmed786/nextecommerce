'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '../types/layouttype';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cart);
  }, []);

  const updateCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event('cartChanged'));
  };

  const increaseQty = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id
        ? { ...item, Qty: item.Qty + 1, total: item.price * (item.Qty + 1) }
        : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id && item.Qty > 1
        ? { ...item, Qty: item.Qty - 1, total: item.price * (item.Qty - 1) }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    updateCart(updated);
  };

  const grandTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center sm:text-left">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg shadow-sm"
            >
           
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
                <div className="min-w-[8rem]">
                  <h2 className="text-sm font-medium">{item.name}</h2>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
              </div>

              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="px-2">{item.Qty}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

            
              <div className="flex flex-col sm:items-end gap-2">
                <p className="font-medium">${item.total}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

         
          <div className="text-center sm:text-right mt-6 space-y-4">
            <p className="text-lg font-semibold">Total: ${grandTotal}</p>
            <Link href="/checkout">
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
