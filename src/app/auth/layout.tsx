import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Campus Connect | Auth",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-radial px-4 py-10 text-white">
      <div className="mx-auto mb-8 flex max-w-4xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-lg font-semibold">
          Campus Connect
        </Link>
        <div className="text-sm text-white/70">
          Built for students — secure login & collaboration
        </div>
      </div>
      <div className="mx-auto max-w-4xl">
        {children}
      </div>
    </div>
  );
}

