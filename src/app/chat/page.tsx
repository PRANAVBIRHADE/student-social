import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import ChatList from "@/components/ChatList";
import { MessageCircle } from "lucide-react";

export default async function ChatPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get all conversations (users who have sent/received messages with current user)
  const conversations = await prisma.message.findMany({
    where: {
      OR: [{ fromId: user.id }, { toId: user.id }],
    },
    include: {
      from: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          email: true,
        },
      },
      to: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by conversation partner
  const conversationMap = new Map<string, any>();
  conversations.forEach((msg) => {
    const partnerId = msg.fromId === user.id ? msg.toId : msg.fromId;
    const partner = msg.fromId === user.id ? msg.to : msg.from;
    
    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        partner,
        lastMessage: msg,
        unreadCount: 0,
      });
    } else {
      const conv = conversationMap.get(partnerId);
      if (msg.createdAt > conv.lastMessage.createdAt) {
        conv.lastMessage = msg;
      }
      if (msg.toId === user.id && !msg.seen) {
        conv.unreadCount++;
      }
    }
  });

  const conversationList = Array.from(conversationMap.values());

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-indigo-200" />
            <h2 className="text-2xl font-semibold text-white">Messages</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-300">Chat with your classmates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          <ChatList conversations={conversationList} currentUserId={user.id} />
          <div className="glass-card rounded-2xl p-12 text-center">
            <MessageCircle className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-300">Select a conversation to start chatting</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

