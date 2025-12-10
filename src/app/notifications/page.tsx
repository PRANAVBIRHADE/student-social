import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import { Bell, Heart, MessageCircle, UserPlus, Mail } from "lucide-react";
import Link from "next/link";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Mark as read
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="h-5 w-5 text-amber-400" />;
      case "COMMENT":
        return <MessageCircle className="h-5 w-5 text-sky-400" />;
      case "FOLLOW":
        return <UserPlus className="h-5 w-5 text-indigo-400" />;
      case "MESSAGE":
        return <Mail className="h-5 w-5 text-emerald-400" />;
      default:
        return <Bell className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getNotificationText = (notification: any) => {
    const payload = notification.payload as any;
    const fromUser = payload.from ? `@${payload.from}` : "Someone";

    switch (notification.type) {
      case "LIKE":
        return `${fromUser} liked your post`;
      case "COMMENT":
        return `${fromUser} commented on your post`;
      case "FOLLOW":
        return `${fromUser} started following you`;
      case "MESSAGE":
        return `${fromUser} sent you a message`;
      default:
        return "New notification";
    }
  };

  const getNotificationLink = (notification: any) => {
    const payload = notification.payload as any;
    if (payload.postId) {
      return `/posts/${payload.postId}`;
    }
    if (payload.from) {
      return `/profile/${payload.from}`;
    }
    return "#";
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-indigo-200" />
            <h2 className="text-2xl font-semibold text-white">Notifications</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-300">Stay updated with your activity</p>
        </div>

        {notifications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Bell className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <p className="text-zinc-300">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={getNotificationLink(notification)}
                className="glass-card rounded-2xl p-4 flex items-start gap-4 hover:bg-white/5 transition"
              >
                <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-200">{getNotificationText(notification)}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

