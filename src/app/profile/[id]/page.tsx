import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";
import { UserPlus, Users, FileText } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const profileUser = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      coverImage: true,
      college: true,
      department: true,
      year: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!profileUser) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-zinc-300">User not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Get follow stats
  const [followersCount, followingCount] = await Promise.all([
    prisma.follow.count({ where: { followingId: params.id } }),
    prisma.follow.count({ where: { followerId: params.id } }),
  ]);

  // Check if current user follows this profile
  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: params.id,
      },
    },
  });

  // Get user's posts
  const posts = await prisma.post.findMany({
    where: {
      authorId: params.id,
      visibility: currentUser.id === params.id ? undefined : "PUBLIC",
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
        where: { userId: currentUser.id },
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
  });

  const isOwnProfile = currentUser.id === params.id;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Cover Image */}
        <div className="glass-card rounded-2xl overflow-hidden mb-6">
          <div
            className="h-48 bg-gradient-to-r from-indigo-500 to-sky-400"
            style={
              profileUser.coverImage
                ? { backgroundImage: `url(${profileUser.coverImage})`, backgroundSize: "cover" }
                : {}
            }
          />
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 -mt-12 rounded-full bg-gradient-to-r from-indigo-400 to-sky-300 flex items-center justify-center text-white text-2xl font-bold border-4 border-black/40">
                {profileUser.profileImage ? (
                  <img
                    src={profileUser.profileImage}
                    alt={profileUser.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  profileUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-white">{profileUser.name}</h1>
                    {profileUser.college && (
                      <p className="text-sm text-zinc-300 mt-1">{profileUser.college}</p>
                    )}
                    {profileUser.department && profileUser.year && (
                      <p className="text-xs text-zinc-400 mt-1">
                        {profileUser.department} • Year {profileUser.year}
                      </p>
                    )}
                  </div>
                  {!isOwnProfile && (
                    <FollowButton
                      userId={params.id}
                      isFollowing={!!isFollowing}
                      followersCount={followersCount}
                    />
                  )}
                  {isOwnProfile && (
                    <Link
                      href="/settings"
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                    >
                      Edit Profile
                    </Link>
                  )}
                </div>
                {profileUser.bio && (
                  <p className="mt-3 text-sm text-zinc-200">{profileUser.bio}</p>
                )}
                <div className="flex items-center gap-6 mt-4 text-sm text-zinc-300">
                  <Link
                    href={`/profile/${params.id}/followers`}
                    className="flex items-center gap-1 hover:text-white transition"
                  >
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">{followersCount}</span> Followers
                  </Link>
                  <Link
                    href={`/profile/${params.id}/following`}
                    className="flex items-center gap-1 hover:text-white transition"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="font-semibold">{followingCount}</span> Following
                  </Link>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">{posts.length}</span> Posts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
          {posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-zinc-300">
                {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser.id}
                  isLiked={post.likes.length > 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

