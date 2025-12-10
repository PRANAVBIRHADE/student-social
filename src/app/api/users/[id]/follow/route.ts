import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.id === params.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: params.id,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 400 });
    }

    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: params.id,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: params.id,
        type: "FOLLOW",
        payload: {
          from: user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow user failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: user.id,
        followingId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unfollow user failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

