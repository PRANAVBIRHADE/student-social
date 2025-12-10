// Email utility for sending password reset emails
// In production, integrate with Resend, SendGrid, or your email service

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  // TODO: Replace with actual email service (Resend, SendGrid, etc.)
  // For now, log the reset link for development
  if (process.env.NODE_ENV === "development") {
    console.log("=== PASSWORD RESET EMAIL ===");
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log("===========================");
  }

  // Example with Resend (uncomment and configure):
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "noreply@yourdomain.com",
    to: email,
    subject: "Reset your password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
  */

  return { success: true };
}

