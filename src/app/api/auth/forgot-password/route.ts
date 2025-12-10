import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = forgotPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email", issues: parsed.error.flatten() }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store token in VerificationToken table (reuse NextAuth's table)
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: parsed.data.email,
          token: resetToken,
        },
      },
      create: {
        identifier: parsed.data.email,
        token: resetToken,
        expires,
      },
      update: {
        token: resetToken,
        expires,
      },
    });

    // Send reset email
    await sendPasswordResetEmail(parsed.data.email, resetToken);

    return NextResponse.json(
      { message: "If an account exists with this email, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

