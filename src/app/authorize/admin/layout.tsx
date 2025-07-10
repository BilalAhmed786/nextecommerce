'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'ADMIN') {
      router.replace('/authorize/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
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
        </ul>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
