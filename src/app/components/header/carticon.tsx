'use client';
import React, { useEffect, useState } from 'react';
import { HiShoppingCart, HiUser } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';


const Cart = () => {
  const [cartLength, setCartLength] = useState(0);
  const { data: session, status } = useSession();

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

    <div className='flex gap-3'>
      {!session?.user.id ?
        <div className="relative group hidden lg:block md:hidden">
          <div className="hover:scale-110 text-[25px] hover:text-green-200 transition-transform duration-200">
            <HiUser />
          </div>
          <div className="hidden absolute top-6.5 -left-7 group-hover:block z-50 transition-all duration-300">
            <ul className="bg-white w-[100px] text-black text-[15px] font-extralight shadow-md">
              <li className="text-center p-2 border-b border-gray-300">
                <Link href="/login">Login</Link>
              </li>
              <li className="text-center p-2">
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
        :
        <div
          className="hover:scale-110 hidden md:hidden lg:block mt-0.5 text-[20px] hover:text-green-200 transition-transform duration-200"
          onClick={() => signOut({ callbackUrl: '/login'})}
        >
          <FiLogOut />
        </div>

      }


      <Link href={'/cart'}>
        <div className="relative top-0.5 z-50 hover:scale-110 hover:text-green-200 transition-transform duration-200">
          <HiShoppingCart size={24} />
          {cartLength > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cartLength}
            </span>
          )}
        </div>
      </Link>

    </div>
  )
};

export default Cart;
