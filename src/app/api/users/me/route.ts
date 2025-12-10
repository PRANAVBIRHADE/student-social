import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  college: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  year: z.number().int().min(1).max(5).optional().nullable(),
  bio: z.string().optional().nullable(),
});

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = updateUserSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        department: true,
        year: true,
        bio: true,
        profileImage: true,
        coverImage: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update user failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

