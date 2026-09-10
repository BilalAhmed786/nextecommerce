"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { forget_password } from "@/app/graphql/user";
import Link from "next/link";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowLeft,
  HiArrowRight,
} from "react-icons/hi";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [validation, setValidation] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [forgotPassword, { loading }] = useMutation(forget_password, {
    onCompleted: (data) => {
      setValidation(data.forgetpassword);
      setIsSuccess(true);
    },
    onError: (error) => {
      setValidation(error.message);
      setIsSuccess(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidation("");
    setIsSuccess(false);

    if (!email.trim()) {
      setValidation("Please enter your email address.");
      return;
    }

    await forgotPassword({
      variables: {
        email: email.trim(),
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] mt-30 lg:mt-14 md:mt-28">
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
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-4 shadow-2xl shadow-black/40">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-3xl text-amber-400 shadow-lg shadow-amber-500/5">
              <HiOutlineLockClosed />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Forgot your password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              No worries. Enter your email address and we&apos;ll send you a
              secure link to reset your password.
            </p>
          </div>

          {/* Validation / status */}
          {validation && (
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

              <p>{validation}</p>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/10"
                  />
                </div>
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
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <HiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Success action */}
          {isSuccess && (
            <div className="mt-7 rounded-xl border border-white/5 bg-white/[0.03] p-5 text-center">
              <p className="text-sm leading-6 text-gray-400">
                Check your inbox for the password reset instructions. If you
                don&apos;t see the email, check your spam folder.
              </p>
            </div>
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

        {/* Security */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <HiOutlineLockClosed className="text-amber-500/70" />
          Your account security matters to us
        </div>
      </div>
    </main>
  );
}