'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  FiX,
  FiMenu,
  FiShoppingBag,
  FiMapPin,
  FiLock,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiShield,
} from 'react-icons/fi';

const clientsidebar = () => {
  const [toggle, setToggle] = useState(false);

  const closeSidebar = () => {
    setToggle(false);
  };

  return (
    <>
      {/* Backdrop */}
      {toggle && (
        <button
          type="button"
          aria-label="Close customer sidebar"
          onClick={closeSidebar}
          className="
            fixed inset-0 z-40
            bg-black/60
            backdrop-blur-sm
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[280px] flex-col
          overflow-hidden
          border-r border-white/10
          bg-[#0a0a0a]
          text-white
          shadow-2xl shadow-black/40
          transition-transform duration-500 ease-out
          ${toggle ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Background glow */}
        <div className="
          pointer-events-none absolute
          -right-20 -top-20
          h-64 w-64
          rounded-full
          bg-amber-500/15
          blur-[100px]
        " />

        <div className="
          pointer-events-none absolute
          -bottom-20 -left-20
          h-56 w-56
          rounded-full
          bg-amber-500/5
          blur-[90px]
        " />

        {/* Header */}
        <div className="
          relative flex items-center justify-between
          border-b border-white/10
          px-5 py-5
        ">
          <div className="flex items-center gap-3">
            <div className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              bg-amber-500
              text-black
              shadow-lg shadow-amber-500/20
            ">
              <FiUser size={20} />
            </div>

            <div>
              <p className="
                text-[10px] font-bold uppercase
                tracking-[0.25em] text-amber-500
              ">
                Account
              </p>

              <h2 className="text-lg font-black">
                Customer Panel
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              border border-white/10
              bg-white/5
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-4 py-7">
          <p className="
            mb-3 px-3
            text-[10px] font-bold uppercase
            tracking-[0.25em] text-gray-600
          ">
            My Account
          </p>

          <div className="space-y-2">

            {/* Orders */}
            <Link
              href="/authorize/client/myorders"
              onClick={closeSidebar}
              className="
                group flex items-center justify-between
                rounded-2xl
                border border-transparent
                px-3 py-3
                transition-all
                hover:border-white/10
                hover:bg-white/[0.06]
              "
            >
              <div className="flex items-center gap-3">
                <span className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-white/5
                  text-gray-400
                  transition
                  group-hover:bg-amber-500/10
                  group-hover:text-amber-400
                ">
                  <FiShoppingBag size={18} />
                </span>

                <div>
                  <p className="text-sm font-bold text-gray-300 group-hover:text-white">
                    My Orders
                  </p>
                  <p className="text-[10px] text-gray-600">
                    View your purchases
                  </p>
                </div>
              </div>

              <FiChevronRight
                size={16}
                className="
                  text-gray-700
                  transition
                  group-hover:translate-x-1
                  group-hover:text-amber-400
                "
              />
            </Link>

            {/* Address */}
            <Link
              href="/authorize/client/address"
              onClick={closeSidebar}
              className="
                group flex items-center justify-between
                rounded-2xl
                border border-transparent
                px-3 py-3
                transition-all
                hover:border-white/10
                hover:bg-white/[0.06]
              "
            >
              <div className="flex items-center gap-3">
                <span className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-white/5
                  text-gray-400
                  transition
                  group-hover:bg-amber-500/10
                  group-hover:text-amber-400
                ">
                  <FiMapPin size={18} />
                </span>

                <div>
                  <p className="text-sm font-bold text-gray-300 group-hover:text-white">
                    Address
                  </p>
                  <p className="text-[10px] text-gray-600">
                    Manage delivery address
                  </p>
                </div>
              </div>

              <FiChevronRight
                size={16}
                className="
                  text-gray-700
                  transition
                  group-hover:translate-x-1
                  group-hover:text-amber-400
                "
              />
            </Link>

            {/* Password */}
            <Link
              href="/authorize/client/resetpassword"
              onClick={closeSidebar}
              className="
                group flex items-center justify-between
                rounded-2xl
                border border-transparent
                px-3 py-3
                transition-all
                hover:border-white/10
                hover:bg-white/[0.06]
              "
            >
              <div className="flex items-center gap-3">
                <span className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-white/5
                  text-gray-400
                  transition
                  group-hover:bg-amber-500/10
                  group-hover:text-amber-400
                ">
                  <FiLock size={17} />
                </span>

                <div>
                  <p className="text-sm font-bold text-gray-300 group-hover:text-white">
                    Reset Password
                  </p>
                  <p className="text-[10px] text-gray-600">
                    Update your password
                  </p>
                </div>
              </div>

              <FiChevronRight
                size={16}
                className="
                  text-gray-700
                  transition
                  group-hover:translate-x-1
                  group-hover:text-amber-400
                "
              />
            </Link>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="relative border-t border-white/10 p-4">

          {/* Security */}
          <div className="
            mb-3 flex items-center gap-3
            rounded-2xl
            border border-amber-500/10
            bg-amber-500/[0.06]
            p-4
          ">
            <div className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-amber-500/10
              text-amber-400
            ">
              <FiShield size={16} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-300">
                Secure Account
              </p>
              <p className="mt-0.5 text-[10px] text-gray-600">
                Your account is protected
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() =>
              signOut({ callbackUrl: '/login' })
            }
            className="
              group flex w-full items-center gap-3
              rounded-2xl
              border border-red-500/10
              bg-red-500/[0.04]
              px-4 py-3
              text-left
              transition-all
              hover:border-red-500/20
              hover:bg-red-500/10
            "
          >
            <span className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-red-500/10
              text-red-400
              transition
              group-hover:bg-red-500
              group-hover:text-white
            ">
              <FiLogOut size={16} />
            </span>

            <div>
              <p className="text-sm font-bold text-gray-300 group-hover:text-white">
                Logout
              </p>
              <p className="text-[10px] text-gray-600">
                Sign out of your account
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Open sidebar button */}
      {!toggle && (
        <button
          type="button"
          onClick={() => setToggle(true)}
          className="
            fixed left-4 top-24 z-30
            flex items-center gap-2
            rounded-2xl
            border border-amber-400/20
            bg-[#0a0a0a]
            px-4 py-3
            text-sm font-bold
            text-white
            shadow-xl shadow-black/20
            transition-all
            hover:-translate-y-0.5
            hover:border-amber-400/40
            hover:shadow-amber-500/10
          "
        >
          <FiMenu
            size={18}
            className="text-amber-400"
          />

          <span>My Account</span>
        </button>
      )}
    </>
  );
};

export default clientsidebar;