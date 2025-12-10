import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-80" />
      <div className="relative z-10 max-w-5xl text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
          <Sparkles className="h-4 w-4 text-indigo-200" />
          Student-first social platform
        </div>
        <h1 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          Build your campus community with
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-200 bg-clip-text text-transparent">
            {" "}
            Campus Connect
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-200 sm:text-xl">
          Share notes, find collaborators, chat in real-time, and stay on top of
          what&apos;s happening across campus with a premium, student-focused experience.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 px-6 py-3 text-lg font-medium text-white shadow-soft transition hover:scale-[1.01] hover:shadow-glass"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-lg font-medium text-white/80 backdrop-blur transition hover:border-white/40 hover:text-white"
          >
            Explore feed
          </Link>
        </div>
        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          {[
            {
              title: "Realtime chat",
              icon: <MessageCircle className="h-4 w-4 text-sky-200" />,
              copy: "1:1 messaging with presence, media, and read receipts.",
            },
            {
              title: "Smart feed",
              icon: <Sparkles className="h-4 w-4 text-indigo-200" />,
              copy: "Curated posts from classmates, clubs, and trending tags.",
            },
            {
              title: "Secure & private",
              icon: <ArrowRight className="h-4 w-4 text-amber-200" />,
              copy: "Privacy controls, safe reporting, and verified campus accounts.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-glass"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                {feature.icon}
                {feature.title}
              </div>
              <p className="text-sm text-zinc-200">{feature.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
