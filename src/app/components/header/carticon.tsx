'use client';

import { useEffect, useState } from "react";
import { HiShoppingCart, HiUser } from "react-icons/hi";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Cart = () => {
  const [cartLength, setCartLength] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const stored = localStorage.getItem("cart");
        const cart = stored ? JSON.parse(stored) : [];
        setCartLength(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCartLength(0);
      }
    };

    updateCartCount();

    window.addEventListener("cartChanged", updateCartCount);

    return () => {
      window.removeEventListener("cartChanged", updateCartCount);
    };
  }, []);

  return (
    <div className="flex items-center gap-3">

      {/* Account */}
      {!session?.user?.id ? (
        <div className="group relative hidden lg:block">

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-gray-300 transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <HiUser className="text-lg" />

            <span className="text-xs font-medium">
              Account
            </span>

            <FiChevronDown className="text-xs transition-transform duration-300 group-hover:rotate-180" />
          </button>

          {/* Dropdown */}
          <div className="invisible absolute right-0 top-12 z-[100] w-44 translate-y-2 rounded-2xl border border-white/10 bg-[#151515] p-2 opacity-0 shadow-2xl shadow-black/40 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

            <div className="mb-1 px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-amber-400">
                Welcome
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Sign in to your account
              </p>
            </div>

            <Link
              href="/login"
              className="block rounded-xl px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="block rounded-xl px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Register
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-gray-300 transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 lg:flex"
        >
          <FiLogOut className="text-sm" />
          <span className="text-xs font-medium">
            Logout
          </span>
        </button>
      )}

      {/* Cart */}
      <Link
        href="/cart"
        aria-label="Shopping cart"
        className="group relative"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-amber-400/50 group-hover:bg-amber-500/10">

          <HiShoppingCart className="text-[21px] text-gray-200 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400" />

          {cartLength > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-[#0b0b0b] bg-amber-500 px-1 text-[9px] font-bold text-black shadow-lg shadow-amber-500/30">
              {cartLength > 99 ? "99+" : cartLength}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Cart;
