"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  followersCount: number;
}

export default function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  followersCount: initialFollowersCount,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (loading) return;

    setLoading(true);
    const wasFollowing = isFollowing;

    // Optimistic update
    setIsFollowing(!wasFollowing);
    setFollowersCount(wasFollowing ? followersCount - 1 : followersCount + 1);

    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: wasFollowing ? "DELETE" : "POST",
      });

      if (!res.ok) {
        // Revert on error
        setIsFollowing(wasFollowing);
        setFollowersCount(wasFollowing ? followersCount : followersCount - 1);
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(wasFollowing);
      setFollowersCount(wasFollowing ? followersCount : followersCount - 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        isFollowing
          ? "border border-white/20 bg-white/5 text-white hover:bg-white/10"
          : "bg-gradient-to-r from-indigo-500 to-sky-400 text-white hover:shadow-glass"
      }`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </button>
  );
}

