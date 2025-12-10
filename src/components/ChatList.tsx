"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface ChatListProps {
  conversations: Array<{
    partner: {
      id: string;
      name: string;
      profileImage: string | null;
      email: string;
    };
    lastMessage: {
      id: string;
      content: string;
      createdAt: Date;
      seen: boolean;
    };
    unreadCount: number;
  }>;
  currentUserId: string;
}

export default function ChatList({ conversations, currentUserId }: ChatListProps) {
  if (conversations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <MessageCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
        <p className="text-sm text-zinc-300">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
      {conversations.map((conv) => (
        <Link
          key={conv.partner.id}
          href={`/chat/${conv.partner.id}`}
          className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition"
        >
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400 to-sky-300 flex items-center justify-center text-white font-semibold">
            {conv.partner.profileImage ? (
              <img
                src={conv.partner.profileImage}
                alt={conv.partner.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              conv.partner.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white truncate">{conv.partner.name}</p>
              {conv.unreadCount > 0 && (
                <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 truncate">{conv.lastMessage.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

