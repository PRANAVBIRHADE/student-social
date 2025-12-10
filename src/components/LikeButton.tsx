"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
}

export default function LikeButton({ postId, isLiked: initialIsLiked, likesCount: initialLikesCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) return;
    
    setLoading(true);
    const wasLiked = isLiked;
    
    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: wasLiked ? "DELETE" : "POST",
      });

      if (!res.ok) {
        // Revert on error
        setIsLiked(wasLiked);
        setLikesCount(wasLiked ? likesCount : likesCount - 1);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(wasLiked);
      setLikesCount(wasLiked ? likesCount : likesCount - 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1 hover:text-amber-200 transition disabled:opacity-50"
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-amber-400 text-amber-400" : ""}`} />
      <span>{likesCount}</span>
    </button>
  );
}

