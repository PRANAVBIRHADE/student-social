import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: params.id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId: user.id,
          postId: params.id,
        },
      }),
      prisma.post.update({
        where: { id: params.id },
        data: {
          likesCount: { increment: 1 },
        },
      }),
    ]);

    // Create notification
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (post && post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: "LIKE",
          payload: {
            postId: params.id,
            from: user.id,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Like post failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: user.id,
          postId: params.id,
        },
      }),
      prisma.post.update({
        where: { id: params.id },
        data: {
          likesCount: { decrement: 1 },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unlike post failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

