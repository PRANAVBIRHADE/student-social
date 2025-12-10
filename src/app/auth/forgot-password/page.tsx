"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
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
            <h1 className="text-2xl font-semibold text-white">Check your email</h1>
            <p className="mt-2 text-sm text-zinc-200">
              If an account exists with this email, we&apos;ve sent a password reset link.
            </p>
            <p className="mt-2 text-xs text-zinc-300">
              In development mode, check your console for the reset link.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="mt-4 inline-flex items-center gap-2 text-sm text-sky-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
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
          <h1 className="mt-2 text-3xl font-semibold text-white">Forgot your password?</h1>
          <p className="mt-2 text-sm text-zinc-200">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="space-y-1 text-sm text-zinc-100">
            <span className="flex items-center gap-2 text-zinc-200">
              <Mail className="h-4 w-4" />
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
              placeholder="your@email.com"
            />
          </label>
          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] hover:shadow-glass disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}

