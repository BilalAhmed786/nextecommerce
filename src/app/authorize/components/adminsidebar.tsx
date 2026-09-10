'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiMenu,
  FiGrid,
  FiFolder,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiLock,
  FiPlus,
  FiList,
} from 'react-icons/fi';

const adminsidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [toggle, setToggle] = useState(false);

  const closeSidebar = () => {
    setToggle(false);
    setShowDropdown(false);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/authorize/admin/dashboard',
      icon: FiGrid,
    },
    {
      label: 'Category',
      href: '/authorize/admin/category',
      icon: FiFolder,
    },
    {
      label: 'Shipment',
      href: '/authorize/admin/shipment',
      icon: FiTruck,
    },
    {
      label: 'Price Filter',
      href: '/authorize/admin/pricefilter',
      icon: FiDollarSign,
    },
    {
      label: 'Orders',
      href: '/authorize/admin/orders',
      icon: FiShoppingBag,
    },
    {
      label: 'Users',
      href: '/authorize/admin/user',
      icon: FiUsers,
    },
    {
      label: 'Reset Password',
      href: '/authorize/admin/resetpassword',
      icon: FiLock,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {toggle && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="
            fixed inset-0 z-40
            bg-black/60
            backdrop-blur-sm
            transition-opacity
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[280px] flex-col
          border-r border-white/10
          bg-[#0a0a0a]
          text-white
          shadow-2xl shadow-black/40
          transition-transform duration-500 ease-out
          ${toggle ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Amber glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl bg-amber-500
              text-black
              shadow-lg shadow-amber-500/20
            ">
              <FiGrid size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                Store
              </p>
              <h2 className="text-lg font-black tracking-tight">
                Admin Panel
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
        <nav className="relative flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
            Management
          </p>

          <ul className="space-y-1.5">

            {menuItems.slice(0, 2).map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className="
                      group flex items-center gap-3
                      rounded-xl px-3 py-3
                      text-sm font-semibold
                      text-gray-400
                      transition-all
                      hover:bg-white/[0.07]
                      hover:text-white
                    "
                  >
                    <span className="
                      flex h-9 w-9 items-center justify-center
                      rounded-lg
                      bg-white/5
                      text-gray-500
                      transition
                      group-hover:bg-amber-500/10
                      group-hover:text-amber-400
                    ">
                      <Icon size={17} />
                    </span>

                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Product Dropdown */}
            <li>
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="
                  group flex w-full items-center justify-between
                  rounded-xl px-3 py-3
                  text-sm font-semibold
                  text-gray-400
                  transition-all
                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                <span className="flex items-center gap-3">
                  <span className="
                    flex h-9 w-9 items-center justify-center
                    rounded-lg bg-white/5
                    text-gray-500
                    transition
                    group-hover:bg-amber-500/10
                    group-hover:text-amber-400
                  ">
                    <FiPackage size={17} />
                  </span>

                  Products
                </span>

                <span className="text-gray-600">
                  {showDropdown ? (
                    <FiChevronUp size={17} />
                  ) : (
                    <FiChevronDown size={17} />
                  )}
                </span>
              </button>

              {showDropdown && (
                <div className="
                  ml-7 mt-1
                  border-l border-white/10
                  pl-3
                  space-y-1
                  animate-in fade-in slide-in-from-top-2
                ">
                  <Link
                    href="/authorize/admin/product"
                    onClick={closeSidebar}
                    className="
                      group flex items-center gap-2
                      rounded-lg px-3 py-2.5
                      text-sm text-gray-500
                      transition
                      hover:bg-amber-500/10
                      hover:text-amber-400
                    "
                  >
                    <FiPlus size={14} />
                    Create Product
                  </Link>

                  <Link
                    href="/authorize/admin/allproducts"
                    onClick={closeSidebar}
                    className="
                      group flex items-center gap-2
                      rounded-lg px-3 py-2.5
                      text-sm text-gray-500
                      transition
                      hover:bg-amber-500/10
                      hover:text-amber-400
                    "
                  >
                    <FiList size={14} />
                    All Products
                  </Link>
                </div>
              )}
            </li>

            {menuItems.slice(2).map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className="
                      group flex items-center gap-3
                      rounded-xl px-3 py-3
                      text-sm font-semibold
                      text-gray-400
                      transition-all
                      hover:bg-white/[0.07]
                      hover:text-white
                    "
                  >
                    <span className="
                      flex h-9 w-9 items-center justify-center
                      rounded-lg
                      bg-white/5
                      text-gray-500
                      transition
                      group-hover:bg-amber-500/10
                      group-hover:text-amber-400
                    ">
                      <Icon size={17} />
                    </span>

                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="relative border-t border-white/10 p-4">
          <div className="
            rounded-2xl
            border border-amber-500/10
            bg-amber-500/[0.06]
            p-4
          ">
            <div className="flex items-center gap-3">
              <div className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-amber-500/10
                text-amber-400
              ">
                <FiLock size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-gray-300">
                  Admin Access
                </p>
                <p className="mt-0.5 text-[10px] text-gray-600">
                  Secure management area
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Open Button */}
      {!toggle && (
        <button
          type="button"
          onClick={() => setToggle(true)}
          className="
            fixed -left-8 top-24 z-30
            flex items-center gap-2
            rounded-2xl
            border border-amber-400/20
            bg-[#0a0a0a]
            p-4 mt-28 lg:mt-20 sm:mt-28
            rotate-90
            text-sm font-bold
            text-white
            shadow-xl shadow-black/20
            transition-all
            hover:-translate-y-0.5
            hover:border-amber-400/40
            hover:shadow-amber-500/10
          "
        >
          <FiMenu className="text-amber-400" size={18} />
          <span>Dashboard</span>
        </button>
      )}
    </>
  );
};

export default adminsidebar;