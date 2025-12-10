import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all"; // all, users, posts, tags

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }

    const results: any = {};

    if (type === "all" || type === "users") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { college: { contains: query, mode: "insensitive" } },
            { department: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          college: true,
          department: true,
        },
        take: 10,
      });
      results.users = users;
    }

    if (type === "all" || type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: query, mode: "insensitive" } },
            { tags: { has: `#${query}` } },
          ],
          visibility: "PUBLIC",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        take: 10,
      });
      results.posts = posts;
    }

    if (type === "all" || type === "tags") {
      const allPosts = await prisma.post.findMany({
        select: { tags: true },
      });
      const tagCounts: Record<string, number> = {};
      allPosts.forEach((post) => {
        post.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      });
      results.tags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

