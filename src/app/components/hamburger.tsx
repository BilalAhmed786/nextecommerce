'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { signOut, useSession } from 'next-auth/react';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <nav className="lg:hidden relative">
   
      <div className="absolute text-center w-full -top-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-center focus:outline-none"
        >
          {isOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      <div
        className={`absolute w-full z-50 p-5 flex flex-col justify-center items-center bg-white mt-4 top-0 left-0
          space-y-6 transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
      >
        <Link
          href="/"
          className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
        >
          Shop
        </Link>
        <Link
          href="/checkout"
          className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
        >
          Checkout
        </Link>
        <Link
          href="/cart"
          className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
        >
          Cart
        </Link>

        {/* Dashboard (based on role) */}
        {session?.user?.role === 'ADMIN' && (
          <Link
            href="/authorize/admin/dashboard"
            className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
          >
            Dashboard
          </Link>
        )}

        {session?.user?.role === 'CUSTOMER' && (
          <Link
            href="/authorize/client/dashboard"
            className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
          >
            Dashboard
          </Link>
        )}

        {/* Auth Links */}
        {!session?.user?.id ? (
          <>
            <Link
              href="/login"
              className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default MobileNavbar;
