import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    },
  });

  return user;
}

