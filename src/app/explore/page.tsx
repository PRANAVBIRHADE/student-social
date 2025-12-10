import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { TrendingUp, Hash } from "lucide-react";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { tag?: string; search?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get trending tags (tags used in most posts)
  const allPosts = await prisma.post.findMany({
    select: { tags: true },
  });

  const tagCounts: Record<string, number> = {};
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const trendingTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);

  // Get posts based on search/tag filter
  let posts;
  if (searchParams.tag) {
    posts = await prisma.post.findMany({
      where: {
        tags: { has: `#${searchParams.tag}` },
        visibility: "PUBLIC",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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
      take: 50,
    });
  } else if (searchParams.search) {
    posts = await prisma.post.findMany({
      where: {
        OR: [
          { content: { contains: searchParams.search, mode: "insensitive" } },
          { tags: { has: `#${searchParams.search}` } },
        ],
        visibility: "PUBLIC",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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
      take: 50,
    });
  } else {
    // All public posts, newest first
    posts = await prisma.post.findMany({
      where: {
        visibility: "PUBLIC",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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
      take: 50,
    });
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">Explore</h2>
          <p className="mt-1 text-sm text-zinc-300">Discover posts from across campus</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {posts.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-zinc-300">No posts found. Try a different search or tag.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user.id}
                    isLiked={post.likes.length > 0}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="glass-card rounded-2xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-amber-200" />
                <h3 className="font-semibold text-white">Trending Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.length > 0 ? (
                  trendingTags.map((tag) => (
                    <a
                      key={tag}
                      href={`/explore?tag=${tag.replace("#", "")}`}
                      className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-sky-200 hover:bg-white/10 transition"
                    >
                      <Hash className="h-3 w-3" />
                      {tag.replace("#", "")}
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400">No trending tags yet</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

