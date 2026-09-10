"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaShoppingBag,
  FaArrowRight,
  FaTimes,
  FaLock,
  FaStore,
} from "react-icons/fa";

import CartContents from "./cartcontent";
import { CartItem } from "../types/layouttype";

export default function CartSidebar() {
  const [toggle, setToggle] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleCartChanged = () => {
      setToggle(true);
    };

    window.addEventListener("cartChanged", handleCartChanged);

    return () => {
      window.removeEventListener("cartChanged", handleCartChanged);
    };
  }, []);

  return (
    <>
      {/* BACKDROP */}

      <div
        onClick={() => setToggle(false)}
        className={`
          fixed inset-0 z-40 bg-black/60
          backdrop-blur-sm
          transition-opacity duration-500
          ${
            toggle
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* CART DRAWER */}

      <aside
        className={`
          fixed right-0 top-0 z-50
          flex h-screen
          w-[92%] max-w-[480px]
          flex-col
          overflow-hidden
          bg-[#111111]
          text-white
          transition-transform duration-500 ease-out
          ${toggle ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* DECORATIVE GLOW */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />

        {/* HEADER */}

        <header className="relative shrink-0 border-b border-white/10 bg-[#151515] px-6 py-5">
          <div className="flex items-center justify-between">
            {/* TITLE */}

            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20">
                <FaShoppingBag />

                {cartItems.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-gray-900 shadow">
                    {cartItems.length}
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-400">
                  Your Selection
                </p>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Shopping Bag
                </h2>
              </div>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setToggle(false)}
              aria-label="Close shopping cart"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-white/10
                bg-white/5
                text-gray-300
                transition-all duration-300
                hover:rotate-90
                hover:border-amber-500/40
                hover:bg-amber-500
                hover:text-gray-950
              "
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* CART STATUS */}

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div>
              <p className="text-xs text-gray-400">
                {cartItems.length === 0
                  ? "Your bag is currently empty"
                  : `${cartItems.length} ${
                      cartItems.length === 1 ? "item" : "items"
                    } in your bag`}
              </p>
            </div>

            <FaShoppingBag className="text-sm text-amber-400" />
          </div>
        </header>

        {/* CART CONTENT */}

        <div className="relative flex-1 overflow-y-auto px-5 py-5">
          <CartContents
            setCartItems={setCartItems}
            cartItems={cartItems}
          />
        </div>

        {/* FOOTER */}

        {cartItems.length > 0 ? (
          <footer className="relative shrink-0 border-t border-white/10 bg-[#151515] px-6 pb-6 pt-5">
            {/* TRUST */}

            <div className="mb-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-gray-500">
              <FaLock className="text-amber-400" />
              Secure checkout
            </div>

            {/* ACTIONS */}

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setToggle(false)}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.06]
                  px-4 py-3.5
                  text-sm font-semibold
                  text-gray-200
                  transition-all duration-300
                  hover:border-amber-500/30
                  hover:bg-white/10
                  hover:text-white
                "
              >
                View Cart
              </Link>

              <Link
                href="/checkout"
                onClick={() => setToggle(false)}
                className="
                  group
                  flex items-center justify-center gap-2
                  rounded-xl
                  bg-amber-500
                  px-4 py-3.5
                  text-sm font-bold
                  text-gray-950
                  shadow-lg shadow-amber-500/10
                  transition-all duration-300
                  hover:bg-amber-400
                  hover:shadow-amber-500/20
                "
              >
                Checkout

                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="mt-4 text-center text-[10px] leading-4 text-gray-500">
              Review your items before completing your order.
            </p>
          </footer>
        ) : (
          <footer className="relative shrink-0 border-t border-white/10 bg-[#151515] px-6 pb-7 pt-5">
            <Link
              href="/"
              onClick={() => setToggle(false)}
              className="
                group
                flex w-full
                items-center justify-center gap-3
                rounded-xl
                bg-amber-500
                px-5 py-4
                text-sm font-bold
                text-gray-950
                shadow-lg shadow-amber-500/10
                transition-all duration-300
                hover:bg-amber-400
              "
            >
              <FaStore className="text-sm" />

              Continue Shopping

              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="mt-4 text-center text-[10px] text-gray-500">
              Add something you love to your shopping bag.
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}