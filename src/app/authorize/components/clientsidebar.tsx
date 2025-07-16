'use client'
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';


const clientsidebar = () => {

    const [toggle, setToggle] = useState(false)

    return (

        <div className='min-h-full mt-20'>
            <aside className={`w-64 p-4 text-white h-14 bg-linear-to-t from-sky-600 to-indigo-700 min-h-full fixed top-0 z-50 trans transition-trans duration-500 ease-in ${toggle ? 'translate-x-0' : '-translate-x-full'}`}
            >

                <button className='absolute right-3 border-1 px-1 text-xs rounded-full'
                    onClick={() => {
                        setToggle(false)
                        

                    }}
                >X

                </button>
                <h2 className="text-lg font-semibold mb-4">Customer Panel</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/authorize/client/myorders"
                            className="block px-2 py-1 hover:bg-gray-700 rounded"
                        >
                            My Orders
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/authorize/client/address"
                            className="block px-2 py-1 hover:bg-gray-700 rounded"
                        >
                            Address
                        </Link>
                    </li>
                      <li>
                        <Link
                            href="/authorize/client/resetpassword"
                            className="block px-2 py-1 hover:bg-gray-700 rounded"
                        >
                            Reset Password
                        </Link>
                    </li>
                     <li 
                     onClick={() => signOut({ callbackUrl: '/login' })}
                     className="block px-2 py-1 hover:bg-gray-700 rounded cursor-pointer"
                     >
                        logout
                        
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

export default clientsidebar