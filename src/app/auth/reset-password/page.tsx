"use client";

import { FormEvent, Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid reset link. Please request a new password reset.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card mx-auto max-w-md overflow-hidden rounded-2xl p-8 shadow-glass">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-emerald-400/20 p-3">
            <CheckCircle className="h-6 w-6 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Password reset successful</h1>
            <p className="mt-2 text-sm text-zinc-200">Your password has been updated. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="glass-card mx-auto max-w-md overflow-hidden rounded-2xl p-8 shadow-glass">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-amber-400/20 p-3">
            <AlertCircle className="h-6 w-6 text-amber-200" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Invalid reset link</h1>
            <p className="mt-2 text-sm text-zinc-200">This password reset link is invalid or has expired.</p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="mt-4 inline-flex items-center gap-2 text-sm text-sky-200 hover:text-white"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card mx-auto max-w-md overflow-hidden rounded-2xl p-8 shadow-glass">
      <div className="flex flex-col gap-6">
        <div>
          <Link href="/auth/login" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <p className="text-sm uppercase tracking-[0.15em] text-indigo-200">Reset password</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Create new password</h1>
          <p className="mt-2 text-sm text-zinc-200">Enter your new password below.</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="space-y-1 text-sm text-zinc-100">
            <span className="flex items-center gap-2 text-zinc-200">
              <Lock className="h-4 w-4" />
              New Password
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
              placeholder="At least 8 characters"
            />
          </label>
          <label className="space-y-1 text-sm text-zinc-100">
            <span className="flex items-center gap-2 text-zinc-200">
              <Lock className="h-4 w-4" />
              Confirm Password
            </span>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
              placeholder="Confirm your password"
            />
          </label>
          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] hover:shadow-glass disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}

