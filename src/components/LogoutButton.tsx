"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5 hover:text-white"
    >
      <LogOut className="h-5 w-5" />
      Sign out
    </button>
  );
}

