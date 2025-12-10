"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      college: formData.get("college") || undefined,
      department: formData.get("department") || undefined,
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Unable to register");
      return;
    }

    router.push("/auth/login?registered=true");
  }

  return (
    <div className="glass-card mx-auto grid max-w-3xl grid-cols-1 gap-8 overflow-hidden rounded-2xl p-8 shadow-glass lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.15em] text-indigo-200">Join campus connect</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Create your student account</h1>
          <p className="mt-2 text-sm text-zinc-200">
            Share notes, connect with classmates, and collaborate in real-time.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field label="Full name" name="name" icon={<User className="h-4 w-4" />} required />
          <Field label="Email" name="email" type="email" icon={<Mail className="h-4 w-4" />} required />
          <Field label="Password" name="password" type="password" icon={<Lock className="h-4 w-4" />} required />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="College" name="college" />
            <Field label="Department" name="department" />
            <Field label="Year" name="year" type="number" min={1} max={8} />
          </div>
          {error ? <p className="text-sm text-amber-200">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] hover:shadow-glass disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create account
          </button>
        </form>
        <p className="text-sm text-zinc-200">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-sky-200 hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
      <div className="relative hidden flex-col justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur lg:flex">
        <div>
          <p className="text-sm text-indigo-100">Why join</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-100">
            <li>• Curated feeds from your classmates and clubs</li>
            <li>• Private 1:1 messaging with presence & media</li>
            <li>• Post events, notes, and project updates with ease</li>
          </ul>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-100">
          <p className="font-semibold text-white">Tip</p>
          Use your campus email so classmates can find you faster.
        </div>
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
  min,
  max,
}: {
  label: string;
  name: string;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
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
        min={min}
        max={max}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
      />
    </label>
  );
}

