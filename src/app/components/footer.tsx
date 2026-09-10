"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaArrowRight,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#090909] text-white">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Top border */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* 4 Columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1 - Brand */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-xl font-black text-black shadow-lg shadow-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                T
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-tight">
                  Thrifter&apos;s
                  <span className="text-amber-400"> Point</span>
                </h2>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                  Shop smarter
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-gray-400">
              Discover quality products, great deals, and a shopping
              experience designed around you.
            </p>

            {/* Social icons */}
            <div className="mt-7 flex gap-3">
              {[
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaGithub />, label: "Github" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-500 hover:text-black"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white">
              Shop
            </h3>

            <ul className="space-y-4 text-sm">
              {[
                ["All Products", "/"],
                ["Categories", "/categories"],
                ["New Arrivals", "/new-arrivals"],
                ["Sale", "/sale"],
                ["Cart", "/cart"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-gray-400 transition-colors duration-200 hover:text-amber-400"
                  >
                    <span className="h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Customer Care */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white">
              Customer Care
            </h3>

            <ul className="space-y-4 text-sm">
              {[
                ["My Account", "/account"],
                ["My Orders", "/orders"],
                ["Checkout", "/checkout"],
                ["Shipping Info", "/shipping"],
                ["Contact Us", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-gray-400 transition-colors duration-200 hover:text-amber-400"
                  >
                    <span className="h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white">
              Get In Touch
            </h3>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    Pakistan
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    support@thrifterspoint.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
                  <FaPhoneAlt />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    +92 300 0000000
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <Link
              href="/"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-400 transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-400 hover:text-black"
            >
              Start Shopping
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-500">
            © 2025{" "}
            <span className="font-semibold text-gray-300">
              Thrifter&apos;s Point
            </span>
            . All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-gray-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-amber-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-amber-400"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
