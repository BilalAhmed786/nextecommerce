'use client'
import Link from 'next/link';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const sidebar = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [toggle, setToggle] = useState(false)

    return (

        <div className='min-h-full mt-20'>
            <aside className={`w-64 p-4 bg-gray-100 min-h-full fixed top-0 z-50 trans transition-trans duration-500 ease-in ${toggle ? 'translate-x-0' : '-translate-x-full'}`}
            >

                <button className='absolute right-3 border-1 px-1 text-xs rounded-full'
                    onClick={() => {
                        setToggle(false)
                        setShowDropdown(false)

                    }}
                >X

                </button>
                <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/authorize/admin/category"
                            className="block px-2 py-1 hover:bg-gray-200 rounded"
                        >
                            Category
                        </Link>
                    </li>
                    <li>
                        <div
                            className="relative block px-4 py-1 hover:bg-gray-200 rounded cursor-pointer"
                            onClick={() => setShowDropdown(prev => !prev)}
                        >
                            {showDropdown ?
                                <FiChevronUp className='absolute left-0 top-1.5' /> :
                                <FiChevronDown className='absolute left-0 top-1.5' />} Product
                        </div>

                        {showDropdown && (
                            <div className="ml-4 mt-2 space-y-2">
                                <Link
                                    href="/authorize/admin/product"
                                    className="block px-2 py-1 hover:bg-gray-200 rounded"
                                >
                                    Create Product
                                </Link>
                                <Link
                                    href="/authorize/admin/allproducts"
                                    className="block px-2 py-1 hover:bg-gray-200 rounded"
                                >
                                    All Products
                                </Link>
                            </div>
                        )}
                    </li>
                    <li>
                        <Link
                            href="/authorize/admin/shipment"
                            className="block px-2 py-1 hover:bg-gray-200 rounded"
                        >
                            Shipement
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/authorize/admin/pricefilter"
                            className="block px-2 py-1 hover:bg-gray-200 rounded"
                        >
                            Price filter
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/authorize/admin/orders"
                            className="block px-2 py-1 hover:bg-gray-200 rounded"
                        >
                            Orders
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/authorize/admin/user"
                            className="block px-2 py-1 hover:bg-gray-200 rounded"
                        >
                            Users
                        </Link>
                    </li>
                     <li>
                        <Link
                            href="/authorize/admin/resetpassword"
                            className="block px-2 py-1 hover:bg-gray-200 rounded"
                        >
                            Reset Password
                        </Link>
                    </li>
                </ul>
            </aside>

            <button className='fixed top-28 -left-7 bg-red-600 text-white px-2 py-1 rotate-90  z-10'
                onClick={() => setToggle(true)}
            >
                Dashboard
            </button>


        </div>

    )
}

export default sidebar