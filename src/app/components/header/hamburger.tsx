'use client';

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiShoppingBag,
  HiOutlineLogout,
  HiOutlineUser,
} from "react-icons/hi";
import { signOut, useSession } from "next-auth/react";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="relative lg:hidden">

      {/* Mobile bar */}
      <div className="flex h-12 items-center justify-center border-t border-white/10">

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-gray-200 transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-400"
        >
          {isOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile drawer */}
      <div
        className={`absolute left-0 top-12 z-[100] w-full overflow-hidden border-t border-white/10 bg-[#111111] shadow-2xl shadow-black/40 transition-all duration-300 ${
          isOpen
            ? "max-h-[650px] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
        }`}
      >

        {/* Drawer header */}
        <div className="border-b border-white/10 px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <HiShoppingBag className="text-xl" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                Thrifters
              </p>

              <p className="text-sm text-gray-400">
                Explore our collection
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1 p-4">

          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-amber-400"
          >
            <span>Shop</span>
            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-amber-400">
              →
            </span>
          </Link>

          <Link
            href="/cart"
            onClick={closeMenu}
            className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-amber-400"
          >
            <span>Cart</span>
            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-amber-400">
              →
            </span>
          </Link>

          <Link
            href="/checkout"
            onClick={closeMenu}
            className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-amber-400"
          >
            <span>Checkout</span>
            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-amber-400">
              →
            </span>
          </Link>
           <Link
            href="/aboutus"
            onClick={closeMenu}
            className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-amber-400"
          >
            <span>Aboutus</span>
            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-amber-400">
              →
            </span>
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/authorize/admin/dashboard"
              onClick={closeMenu}
              className="group flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3.5 text-sm font-medium text-amber-300 transition-all duration-200 hover:bg-amber-500/10"
            >
              <span>Dashboard</span>
              <span>→</span>
            </Link>
          )}

          {session?.user?.role === "CUSTOMER" && (
            <Link
              href="/authorize/client/dashboard"
              onClick={closeMenu}
              className="group flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3.5 text-sm font-medium text-amber-300 transition-all duration-200 hover:bg-amber-500/10"
            >
              <span>Dashboard</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Authentication */}
        <div className="border-t border-white/10 p-4">

          {!session?.user?.id ? (
            <div className="grid grid-cols-2 gap-3">

              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <HiOutlineUser />
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                Register
              </Link>

            </div>
          ) : (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
            >
              <HiOutlineLogout />
              Logout
            </button>
          )}
        </div>

        {/* Bottom decoration */}
        <div className="h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent opacity-60" />
      </div>
    </nav>
  );
};

export default MobileNavbar;