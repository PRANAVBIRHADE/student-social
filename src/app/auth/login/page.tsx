"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registered = searchParams.get("registered");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push("/feed");
  }

  return (
    <div className="glass-card mx-auto grid max-w-3xl grid-cols-1 gap-8 overflow-hidden rounded-2xl p-8 shadow-glass lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.15em] text-indigo-200">Welcome back</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to continue</h1>
          <p className="mt-2 text-sm text-zinc-200">
            Access your personalized feed, messages, and notifications.
          </p>
          {registered ? (
            <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
              Account created. You can log in now.
            </p>
          ) : null}
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Email" name="email" type="email" icon={<Mail className="h-4 w-4" />} required />
          <Field label="Password" name="password" type="password" icon={<Lock className="h-4 w-4" />} required />
          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] hover:shadow-glass disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
        <div className="flex flex-col gap-3 text-sm text-zinc-200">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/feed" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-white/30 hover:shadow-soft"
          >
            <Sparkles className="h-4 w-4 text-amber-200" />
            Continue with Google
          </button>
          <p>
            New here?{" "}
            <Link href="/auth/register" className="font-semibold text-sky-200 hover:text-white">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:block">
        <div className="flex items-center gap-2 text-sm text-indigo-100">
          <ArrowRight className="h-4 w-4" />
          Quick access
        </div>
        <ul className="mt-3 space-y-2 text-sm text-zinc-100">
          <li>• See posts from classmates you follow</li>
          <li>• Join study groups and event chats</li>
          <li>• Receive notifications for likes, comments, follows</li>
        </ul>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  icon,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1 text-sm text-zinc-100">
      <span className="flex items-center gap-2 text-zinc-200">
        {icon}
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
      />
    </label>
  );
}

