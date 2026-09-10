'use client';

import CartContents from '@/app/reusablecomponent/cartcontent';
import Link from 'next/link';
import { CartItem } from '../types/layouttype';
import { useState } from 'react';
import {
  HiArrowLeft,
  HiArrowRight,
  HiShoppingBag,
  HiShieldCheck,
} from 'react-icons/hi';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 pb-16 pt-28 sm:px-6 lg:px-8">

      {/* Background decoration */}
      <div className="pointer-events-none fixed left-1/2 top-20 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] shadow-xl shadow-black/10">
            <HiShoppingBag className="text-2xl text-amber-400" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            Your Selection
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Your Shopping Bag
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Review your selected items and continue when you're ready.
          </p>
        </div>

        {/* Cart container */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-black/[0.04]">

          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Shopping Bag
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {cartItems.length === 0
                  ? 'No items selected'
                  : `${cartItems.length} ${
                      cartItems.length === 1 ? 'item' : 'items'
                    }`}
              </p>
            </div>

            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-amber-600"
            >
              Continue Shopping
              <HiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cart contents */}
          <div className="p-3 sm:p-6">
            <CartContents
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          </div>

        </section>

        {/* Checkout area */}
        {cartItems.length > 0 && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">

            {/* Trust section */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-black/[0.03]">

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <HiShieldCheck className="text-xl text-amber-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Secure checkout
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Your order information is handled securely throughout
                    the checkout process.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  <HiArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* Checkout card */}
            <div className="rounded-3xl bg-[#111111] p-6 text-white shadow-xl shadow-black/10">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Almost There
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Ready to checkout?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Continue to checkout to complete your order.
              </p>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
              >
                Proceed to Checkout
                <HiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <p className="mt-4 text-center text-[11px] text-gray-500">
                Fast • Secure • Simple
              </p>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
