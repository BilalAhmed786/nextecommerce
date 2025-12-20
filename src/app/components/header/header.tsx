'use client';
import Link from "next/link";
import Cart from "./carticon";
import Hamburger from "./hamburger";
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="h-14 bg-linear-to-t from-amber-600 to-amber-700 text-white py-4 w-full">
      <div className="flex w-full justify-between items-center px-5">

        <Link href={'https://thrifterpoint.onrender.com'}>
        
        <h2 className="text-sm md:text-sm lg:text-2xl font-bold">Thrifters point</h2>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200"
            href="/"
          >
            Shop
          </Link>
          <Link
            className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200"
            href="/cart"
          >
            Cart
          </Link>
          <Link
            className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200"
            href="/checkout"
          >
            Checkout
          </Link>

          {session?.user?.role === 'ADMIN' && (
            <Link
              className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200"
              href="/authorize/admin/dashboard"
            >
              Dashboard
            </Link>
          )}

          {session?.user?.role === 'CUSTOMER' && (
            <Link
              className="font-light hover:text-green-200 hover:scale-110 transition-transform duration-200"
              href="/authorize/client/dashboard"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div>
          <Cart />
        </div>
      </div>

      <div className="w-full">
        <Hamburger />
      </div>
    </header>
  );
}
