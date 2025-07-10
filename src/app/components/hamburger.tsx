'use client'
import Link from 'next/link'
import { useState } from 'react'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="text-center lg:hidden relative">
      {/* Top bar */}
      <div className="absolute w-full -top-6">
        
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
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <Link href="/" className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Shop</Link>
        <Link href="/checkout" className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Checkout</Link>
        <Link href="/cart" className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Cart</Link>
        <Link href="/authorize/admin/allproducts" className="text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Dashboard</Link>
        <Link href="/authorize/login" className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Login</Link>
        <Link href="/authorize/register" className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Register</Link>
        <Link href="/authorize/logout" className="w-full text-center border-b border-gray-300 pb-2 text-gray-700 hover:text-black">Logout</Link>
      </div>
    </nav>
  )
}

export default MobileNavbar
