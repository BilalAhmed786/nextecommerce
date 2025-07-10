'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  Qty: number;
  total: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cart);
  }, []);

  // Save to localStorage + trigger global update
  const updateCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event('cartChanged'));
  };

  const increaseQty = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id
        ? {
            ...item,
            Qty: item.Qty + 1,
            total: item.price * (item.Qty + 1),
          }
        : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cartItems
      .map(item =>
        item.id === id && item.Qty > 1
          ? {
              ...item,
              Qty: item.Qty - 1,
              total: item.price * (item.Qty - 1),
            }
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
                <div className='w-40'>
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

              <p className="w-20 text-right font-medium">${item.total}</p>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-lg font-semibold">Total: ${grandTotal}</p>
          <Link href={'http://localhost:3000/checkout'}><button className='bg-green-600 text-white px-6 py-2 rounded'>Proceed to Checkout</button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
