import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        college: parsed.data.college,
        department: parsed.data.department,
        year: parsed.data.year,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    // Log full error for debugging in Vercel logs
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);
    }
    return NextResponse.json(
      { 
        error: "Registration failed", 
        message: message,
        hint: message.includes("table") || message.includes("relation") || message.includes("does not exist") 
          ? "Database tables may not exist. Run 'npm run db:push' to create them." 
          : undefined
      }, 
      { status: 500 }
    );
  }
}

