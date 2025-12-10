import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Home, Search, MessageCircle, Bell, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

export default async function FeedPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get posts from users the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  const allPostIds = [...followingIds, user.id]; // Include own posts

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: allPostIds,
      },
      visibility: "PUBLIC",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          college: true,
          department: true,
        },
      },
      likes: {
        where: { userId: user.id },
        select: { id: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-sky-300 bg-clip-text text-transparent">
              Campus Connect
            </h1>
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
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Your Feed</h2>
            <p className="mt-1 text-sm text-zinc-300">Posts from people you follow</p>
          </div>

          {posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-zinc-300">No posts yet. Start following people to see their posts!</p>
              <Link
                href="/explore"
                className="mt-4 inline-block text-sm text-sky-200 hover:text-white"
              >
                Explore feed →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={user.id} />
              ))}
            </div>
          )}
        </div>
      </main>
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

function PostCard({ post, currentUserId }: { post: any; currentUserId: string }) {
  const isLiked = post.likes.length > 0;
  const likesCount = post._count.likes;
  const commentsCount = post._count.comments;

  return (
    <article className="glass-card rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400 to-sky-300" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.author.id}`} className="font-semibold text-white hover:text-sky-200">
              {post.author.name}
            </Link>
            {post.author.college && (
              <span className="text-xs text-zinc-400">• {post.author.college}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-200">{post.content}</p>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-xs text-sky-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-6 text-sm text-zinc-400">
            <button className="flex items-center gap-1 hover:text-amber-200">
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span>{likesCount}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-sky-200">
              💬 <span>{commentsCount}</span>
            </button>
            <span className="text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

