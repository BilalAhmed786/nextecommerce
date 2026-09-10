'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import {
  FaCheck,
  FaShoppingBag,
  FaArrowRight,
  FaShieldAlt,
  FaHome,
} from 'react-icons/fa';

export default function SuccessPage() {
  useEffect(() => {
    // Remove cart only after successful Stripe payment
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartChanged'));
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-16">

      {/* Background glow */}
      <div className="
        pointer-events-none absolute left-1/2 top-1/2
        h-[500px] w-[500px]
        -translate-x-1/2 -translate-y-1/2
        rounded-full
        bg-amber-500/10
        blur-[120px]
      " />

      <div className="relative w-full max-w-xl text-center">

        {/* Success icon */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">

          <div className="
            absolute inset-0
            animate-pulse
            rounded-full
            bg-amber-500/10
          " />

          <div className="
            relative flex h-20 w-20
            items-center justify-center
            rounded-full
            bg-amber-500
            text-black
            shadow-2xl
            shadow-amber-500/30
          ">
            <FaCheck size={34} />
          </div>
        </div>

        {/* Heading */}
        <p className="
          mb-3 text-xs font-bold uppercase
          tracking-[0.3em] text-amber-500
        ">
          Order Confirmed
        </p>

        <h1 className="
          text-4xl font-black tracking-tight
          text-white sm:text-5xl
        ">
          Payment Successful!
        </h1>

        <p className="
          mx-auto mt-5 max-w-md
          text-base leading-7 text-gray-500
        ">
          Thank you for your purchase. Your payment has been
          successfully processed and your order is now being prepared.
        </p>

        {/* Order status */}
        <div className="
          mx-auto mt-8 max-w-md
          rounded-2xl
          border border-white/10
          bg-white/[0.04]
          p-5
          text-left
          backdrop-blur-xl
        ">
          <div className="flex items-center gap-4">
            <div className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-xl
              bg-amber-500/10
              text-amber-400
            ">
              <FaShoppingBag size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Your order is on its way
              </p>

              <p className="mt-1 text-xs text-gray-500">
                We&apos;ll take care of the rest.
              </p>
            </div>

            <div className="
              ml-auto h-2.5 w-2.5
              rounded-full
              bg-amber-400
              shadow-lg shadow-amber-400/50
            " />
          </div>
        </div>

        {/* Buttons */}
        <div className="
          mt-8 flex flex-col gap-3
          sm:flex-row sm:justify-center
        ">
          <Link
            href="/"
            className="
              inline-flex h-13 items-center justify-center gap-3
              rounded-xl
              bg-amber-500
              px-7
              text-sm font-bold
              text-black
              shadow-lg shadow-amber-500/10
              transition-all
              hover:-translate-y-0.5
              hover:bg-amber-400
              hover:shadow-xl hover:shadow-amber-500/20
            "
          >
            <FaHome />
            Return Home
          </Link>

          <Link
            href="/authorize/client/myorders"
            className="
              inline-flex h-13 items-center justify-center gap-3
              rounded-xl
              border border-white/10
              bg-white/[0.05]
              px-7
              text-sm font-bold
              text-white
              transition-all
              hover:border-amber-500/30
              hover:bg-amber-500/10
              hover:text-amber-400
            "
          >
            View My Orders
            <FaArrowRight size={13} />
          </Link>
        </div>

        {/* Trust message */}
        <div className="
          mt-10 flex items-center
          justify-center gap-2
          text-xs text-gray-600
        ">
          <FaShieldAlt className="text-amber-500/60" />
          Secure payment • Order successfully placed
        </div>

      </div>
    </main>
  );
}