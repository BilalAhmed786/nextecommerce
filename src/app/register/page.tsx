'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { register_user } from '../graphql/user';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const [validation, setValidation] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [registerUser] = useMutation(register_user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (validation) {
      setValidation('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidation('');
    setLoading(true);

    try {
      const { data } = await registerUser({
        variables: formData,
      });

      if (data?.registerUser?.message) {
        setValidation(data.registerUser.message);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
      setValidation('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden mt-28 lg:mt-16 md:mt-28">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/login-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Decorative Glow */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md p-5">

        <div className="rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xls p-4">

          {/* Brand */}
          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-2xl font-bold text-white shadow-lg shadow-amber-600/30">
              N
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join us and start shopping today
            </p>

          </div>

          {/* Validation Message */}
          {validation && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-center text-sm font-medium text-red-600">
                {validation}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
              />

              <p className="mt-2 text-xs text-gray-400">
                Use at least 6 characters.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-600 py-3.5 font-semibold text-white shadow-lg shadow-amber-600/20 transition duration-300 hover:bg-amber-700 hover:shadow-xl hover:shadow-amber-600/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Already registered?
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-amber-600 transition hover:text-amber-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="mt-5 text-center text-xs text-white/70">
          Your information is securely protected.
        </p>

      </div>
    </main>
  );
};

export default RegisterPage;
