import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email verification link to the newly registered user.
 * @param {string} toEmail
 * @param {string} userName
 * @param {string} token
 */
export const sendVerificationEmail = async (toEmail, userName, token) => {
  const verifyUrl = `${process.env.API_BASE_URL}/api/v1/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Code Vimarsh" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Verify your Code Vimarsh account",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#fe8a16">Welcome to Code Vimarsh, ${userName}! 🚀</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 24px;background:#fe8a16;color:#fff;
                  text-decoration:none;border-radius:6px;margin-top:12px">
          Verify Email
        </a>
        <p style="margin-top:16px;font-size:13px;color:#666">
          This link expires in <strong>24 hours</strong>.<br/>
          If you did not sign up, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

/**
 * Sends a password-reset link to the user.
 * @param {string} toEmail
 * @param {string} userName
 * @param {string} token
 */
export const sendPasswordResetEmail = async (toEmail, userName, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Code Vimarsh" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Reset your Code Vimarsh password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#fe8a16">Password Reset Request</h2>
        <p>Hi ${userName}, we received a request to reset your password.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#fe8a16;color:#fff;
                  text-decoration:none;border-radius:6px;margin-top:12px">
          Reset Password
        </a>
        <p style="margin-top:16px;font-size:13px;color:#666">
          This link expires in <strong>1 hour</strong>.<br/>
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
};

/**
 * Sends a thank you email after a user registers for an event.
 * @param {string} toEmail
 * @param {string} userName
 * @param {string} eventName
 */
export const sendEventRegistrationEmail = async (toEmail, userName, eventName) => {
  await transporter.sendMail({
    from: `"Code Vimarsh" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Registration Successful for ${eventName}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#fe8a16">Thank You for Registering, ${userName}! 🚀</h2>
        <p>You have successfully registered for the event: <strong>${eventName}</strong>.</p>
        <p>We are excited to have you on board. Stay tuned for more updates about the event schedule and prerequisites.</p>
        <p style="margin-top:16px;font-size:13px;color:#666">
          If you have any questions, feel free to reply to this email or contact our support team.
        </p>
      </div>
    `,
  });
};
