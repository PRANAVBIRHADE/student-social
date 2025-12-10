import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Link from "next/link";

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
    <Layout>
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
    </Layout>
  );
}
