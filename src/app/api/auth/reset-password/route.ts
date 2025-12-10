import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = resetPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    }

    // Find the reset token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: parsed.data.token,
        expires: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Find user by email (identifier is the email)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const passwordHash = await hashPassword(parsed.data.password);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete the used token
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: verificationToken.identifier,
        token: parsed.data.token,
      },
    });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

