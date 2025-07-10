'use client'
import Link from 'next/link'
import { useState } from 'react'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="lg:hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl focus:outline-none"
        >
          {isOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Mobile links */}
      <div
        className={`absolute  w-full z-50 p-5 flex flex-col bg-white mt-4 left-0
            top-20 space-y-6 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <Link href="/" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Shop</Link>
        <Link href="/checkout" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Checkout</Link>
        <Link href="/cart" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Cart</Link>
        <Link href="/authorize/admin/allproducts" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Dashboard</Link>
        <Link href="/authorize/login" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Login</Link>
        <Link href="/authorize/register" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Register</Link>
        <Link href="/authorize/logout" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Logout</Link>
      </div>
    </nav>
  )
}

export default MobileNavbar
