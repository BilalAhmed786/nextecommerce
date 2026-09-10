'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { change_password } from '@/app/graphql/user';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaLock,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

export default function ResetPasswordPage() {
  const [oldpassword, setOldpassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const { data: session, status } = useSession();

  const [resetPassword, { loading }] = useMutation(change_password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) return;

    setMessage('');

    try {
      const { data } = await resetPassword({
        variables: {
          id: session.user.id,
          oldpassword,
          newpassword,
        },
      });

      const responseMessage = data.changePassword?.message;

      setMessage(responseMessage);

      if (responseMessage === 'Password updated successfully.') {
        setNewPassword('');
        setOldpassword('');
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const success =
    message === 'Password updated successfully.';

  const incorrectPassword =
    message === 'Incorrect old password';

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen -mt-2 items-center justify-center overflow-hidden bg-[#080808] py-16">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-2xl text-black shadow-xl shadow-amber-500/20">
            <FaLock />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-500">
            Account Security
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Change Password
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
            Keep your account secure by choosing a strong new password.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Old password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Current Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldpassword}
                  onChange={(e) => setOldpassword(e.target.value)}
                  required
                  className="
                    h-13 w-full rounded-xl
                    border border-white/10
                    bg-black/40
                    pl-11 pr-4
                    text-sm text-white
                    outline-none
                    transition
                    placeholder:text-gray-600
                    focus:border-amber-500
                    focus:ring-4 focus:ring-amber-500/10
                  "
                />
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                New Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="
                    h-13 w-full rounded-xl
                    border border-white/10
                    bg-black/40
                    pl-11 pr-4
                    text-sm text-white
                    outline-none
                    transition
                    placeholder:text-gray-600
                    focus:border-amber-500
                    focus:ring-4 focus:ring-amber-500/10
                  "
                />
              </div>

              <p className="mt-2 text-xs text-gray-600">
                Use at least 6 characters.
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  success
                    ? 'border-green-500/20 bg-green-500/10 text-green-400'
                    : 'border-red-500/20 bg-red-500/10 text-red-400'
                }`}
              >
                {success ? (
                  <FaCheckCircle className="mt-0.5 shrink-0" />
                ) : (
                  <FaExclamationCircle className="mt-0.5 shrink-0" />
                )}

                <span>{message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !session}
              className="
                flex h-13 w-full items-center justify-center gap-3
                rounded-xl
                bg-amber-500
                font-bold text-black
                shadow-lg shadow-amber-500/10
                transition-all
                hover:bg-amber-400
                hover:shadow-xl hover:shadow-amber-500/20
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Updating Password...
                </>
              ) : (
                <>
                  Update Password
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Forgot password */}
          {incorrectPassword && (
            <div className="mt-6 border-t border-white/10 pt-6 text-center">
              <p className="mb-3 text-sm text-gray-500">
                Can't remember your current password?
              </p>

              <Link
                href={`${process.env.NEXT_PUBLIC_URL}/forgetpassword`}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  border border-amber-500/30
                  bg-amber-500/10
                  px-5 py-2.5
                  text-sm font-bold
                  text-amber-400
                  transition
                  hover:bg-amber-500
                  hover:text-black
                "
              >
                Forgot Password
                <FaArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Security footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <FaShieldAlt className="text-amber-500/60" />
          Your password is securely protected
        </div>
      </div>
    </div>
  );
}