'use client';

import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminWelcomePage() {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user || null);
    });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-white -mt-6">
      <div className="bg-gray-800 shadow-xl rounded-xl p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4 animate-pulse">
          Welcome Back, {user.name || 'Admin'} 
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Manage your store, track sales, and keep everything running smoothly.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/authorize/admin/allproducts')}
            className="bg-amber-500 hover:bg-amber-700 px-5 py-2 rounded-md text-white shadow"
          >
            Manage Products
          </button>

          <button
            onClick={() => router.push('/authorize/admin/orders')}
            className="bg-amber-600 hover:bg-amber-700 px-5 py-2 rounded-md text-white shadow"
          >
            View Orders
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          Not {user.name}?{' '}
          <a href="/api/auth/signout" className="underline text-red-400">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
