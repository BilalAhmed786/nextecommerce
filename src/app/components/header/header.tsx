'use client';

import Link from "next/link";
import Cart from "./carticon";
import Hamburger from "./hamburger";
import { useSession } from "next-auth/react";
import { HiSparkles } from "react-icons/hi2";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="relative w-full border-b border-white/10 bg-[#0b0b0b] text-white">

      {/* Golden glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          href="https://nextecommerce-wheat.vercel.app"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10 shadow-lg shadow-amber-500/10 transition-all duration-300 group-hover:border-amber-400/60 group-hover:bg-amber-500/20">
            <HiSparkles className="text-xl text-amber-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          </div>

          <div className="leading-none">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-400">
              Premium Store
            </p>

            <h1 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
              Thrifters<span className="text-amber-400">'</span> Point
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">

          <Link
            href="/"
            className="group relative rounded-full px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            Shop
            <span className="absolute bottom-1.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-5" />
          </Link>

          <Link
            href="/cart"
            className="group relative rounded-full px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            Cart
            <span className="absolute bottom-1.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-5" />
          </Link>

          <Link
            href="/checkout"
            className="group relative rounded-full px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            Checkout
            <span className="absolute bottom-1.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-5" />
          </Link>
            <Link
            href="/aboutus"
            className="group relative rounded-full px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            Aboutus
            <span className="absolute bottom-1.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-5" />
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/authorize/admin/dashboard"
              className="ml-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-300 transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200"
            >
              Dashboard
            </Link>
          )}

          {session?.user?.role === "CUSTOMER" && (
            <Link
              href="/authorize/client/dashboard"
              className="ml-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-300 transition-all duration-300 hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Cart / Account */}
        <div className="flex items-center">
          <Cart />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="relative lg:hidden">
        <Hamburger />
      </div>
    </header>
  );
}
