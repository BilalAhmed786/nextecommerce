"use client";

import { useMutation } from "@apollo/client";
import { reset_password } from "@/app/graphql/user";
import { use, useState } from "react";
import Link from "next/link";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowLeft,
} from "react-icons/hi";

export default function ResetPasswordForm({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = use(searchParams);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [resetPassword, { loading }] = useMutation(reset_password, {
    onCompleted: (data) => {
      setIsSuccess(true);
      setStatus(data.resetPassword.message);
    },
    onError: (error) => {
      setIsSuccess(false);
      setStatus(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("");
    setIsSuccess(false);

    if (!token) {
      setStatus("This password reset link is missing or invalid.");
      return;
    }

    if (!newPassword) {
      setStatus("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    await resetPassword({
      variables: {
        token,
        newPassword,
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] p-4 mt-28 lg:mt-20 sm:mt-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-xl font-black text-black shadow-lg shadow-amber-500/20">
              T
            </div>

            <div className="text-left">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Thrifter&apos;s{" "}
                <span className="text-amber-400">Point</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Shop smarter
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-7 shadow-2xl shadow-black/40 sm:p-9">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-3xl text-amber-400 shadow-lg shadow-amber-500/5">
              <HiOutlineLockClosed />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Reset your password
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Create a new password for your account. Make sure it is strong
              and easy for you to remember.
            </p>
          </div>

          {/* Status */}
          {status && (
            <div
              className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                isSuccess
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {isSuccess ? (
                <HiCheckCircle className="mt-0.5 shrink-0 text-lg" />
              ) : (
                <HiExclamationCircle className="mt-0.5 shrink-0 text-lg" />
              )}

              <p>{status}</p>
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  New Password
                </label>

                <div className="relative">
                  <HiOutlineLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-amber-400"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="text-lg" />
                    ) : (
                      <HiOutlineEye className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <HiOutlineLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-amber-400"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff className="text-lg" />
                    ) : (
                      <HiOutlineEye className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password hint */}
              <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                <p className="text-xs leading-5 text-gray-500">
                  Use at least{" "}
                  <span className="font-medium text-gray-300">
                    6 characters
                  </span>{" "}
                  for your new password.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-amber-600 text-sm font-bold text-black shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    Update Password
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-7 text-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-amber-400"
            >
              <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Security text */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <HiOutlineLockClosed className="text-amber-500/70" />
          Your password is securely protected
        </div>
      </div>
    </main>
  );
}
