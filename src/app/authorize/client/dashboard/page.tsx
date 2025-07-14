'use client';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function WelcomePage() {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then(session => {
      setUser(session?.user || null);
    });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-6 flex items-center justify-center bg-gradient-to-br from-blue-100 to-violet-200">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-3 animate-bounce">
          Welcome, {user.name || 'Customer'}! 🛍️
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Ready to explore the best deals today?
        </p>

        {user.role === 'admin' ? (
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Go to Admin Dashboard
          </button>
        ) : (
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Start Shopping
          </button>
        )}

        <div className="mt-8 text-sm text-gray-500">
          Not {user.name}? <a  onClick={()=>signOut({ callbackUrl: '/login' })} className="underline text-red-500 cursor-pointer">Logout</a>
        </div>
      </div>
    </div>
  );
}
