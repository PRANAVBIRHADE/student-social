import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Home, Search, MessageCircle, Bell, User, Settings } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          <NavLink href="/feed" icon={<Home className="h-5 w-5" />} mobile>
            Home
          </NavLink>
          <NavLink href="/explore" icon={<Search className="h-5 w-5" />} mobile>
            Explore
          </NavLink>
          <NavLink href="/chat" icon={<MessageCircle className="h-5 w-5" />} mobile>
            Chat
          </NavLink>
          <NavLink href="/notifications" icon={<Bell className="h-5 w-5" />} mobile>
            Notifs
          </NavLink>
          <NavLink href={`/profile/${user.id}`} icon={<User className="h-5 w-5" />} mobile>
            Profile
          </NavLink>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-white/10 bg-black/40 lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-6">
          <div className="mb-8">
            <Link href="/feed">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-sky-300 bg-clip-text text-transparent">
                Campus Connect
              </h1>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-2">
            <NavLink href="/feed" icon={<Home className="h-5 w-5" />}>
              Home
            </NavLink>
            <NavLink href="/explore" icon={<Search className="h-5 w-5" />}>
              Explore
            </NavLink>
            <NavLink href="/chat" icon={<MessageCircle className="h-5 w-5" />}>
              Messages
            </NavLink>
            <NavLink href="/notifications" icon={<Bell className="h-5 w-5" />}>
              Notifications
            </NavLink>
            <NavLink href={`/profile/${user.id}`} icon={<User className="h-5 w-5" />}>
              Profile
            </NavLink>
            <NavLink href="/settings" icon={<Settings className="h-5 w-5" />}>
              Settings
            </NavLink>
            <div className="mt-auto pt-4 border-t border-white/10">
              <LogoutButton />
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
  mobile = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs text-zinc-300 transition hover:text-white"
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5 hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}

