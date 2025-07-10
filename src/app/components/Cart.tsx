'use client';
import React, { useEffect, useState } from 'react';
import { HiShoppingCart } from 'react-icons/hi';
import Link from 'next/link';
const Cart = () => {
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    
    const stored = localStorage.getItem('cart');
    const cart = stored ? JSON.parse(stored) : [];
    setCartLength(cart.length);

    
    const handleCartChange = () => {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      setCartLength(cart.length);
    };

    window.addEventListener('cartChanged', handleCartChange);

    return () => {
      window.removeEventListener('cartChanged', handleCartChange);
    };
  }, []);

  return (
  <Link href={'http://localhost:3000/cart'}>
    <div className="relative">
      <HiShoppingCart size={24} />
      {cartLength > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {cartLength}
        </span>
      )}
    </div>
  </Link>
  );
};

export default Cart;
