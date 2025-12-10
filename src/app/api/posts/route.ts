import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  mediaUrls: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  visibility: z.enum(["PUBLIC", "FOLLOWERS"]).default("PUBLIC"),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = createPostSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content: parsed.data.content,
        mediaUrls: parsed.data.mediaUrls || [],
        tags: parsed.data.tags || [],
        visibility: parsed.data.visibility,
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
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await prisma.post.findMany({
      where: {
        visibility: user ? undefined : "PUBLIC",
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
        likes: user
          ? {
              where: { userId: user.id },
              select: { id: true },
            }
          : false,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Get posts failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

