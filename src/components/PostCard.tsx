import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import LikeButton from "./LikeButton";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    mediaUrls: string[];
    tags: string[];
    createdAt: Date;
    author: {
      id: string;
      name: string;
      profileImage: string | null;
      college: string | null;
      department: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
  };
  currentUserId: string;
  isLiked?: boolean;
}

export default function PostCard({ post, currentUserId, isLiked = false }: PostCardProps) {
  return (
    <article className="glass-card rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${post.author.id}`}>
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400 to-sky-300 flex items-center justify-center text-white font-semibold">
            {post.author.profileImage ? (
              <img src={post.author.profileImage} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              post.author.name.charAt(0).toUpperCase()
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.author.id}`} className="font-semibold text-white hover:text-sky-200 truncate">
              {post.author.name}
            </Link>
            {post.author.college && (
              <span className="text-xs text-zinc-400 truncate">• {post.author.college}</span>
            )}
            {post.author.department && (
              <span className="text-xs text-zinc-400 truncate">• {post.author.department}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-200 whitespace-pre-wrap break-words">{post.content}</p>
          
          {post.mediaUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.mediaUrls.slice(0, 4).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Post media ${idx + 1}`}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/explore?tag=${tag.replace("#", "")}`}
                  className="text-xs text-sky-200 hover:text-white"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-6 text-sm text-zinc-400">
            <LikeButton postId={post.id} isLiked={isLiked} likesCount={post._count.likes} />
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center gap-1 hover:text-sky-200 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post._count.comments}</span>
            </Link>
            <button className="flex items-center gap-1 hover:text-amber-200 transition">
              <Share2 className="h-4 w-4" />
            </button>
            <span className="text-xs ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

