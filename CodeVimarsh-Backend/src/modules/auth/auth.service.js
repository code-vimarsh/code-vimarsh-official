import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import { generateToken } from "../../utils/generateToken.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../services/mail.service.js";

const SALT_ROUNDS = 12;
const EMAIL_TOKEN_EXPIRY_HOURS = 24;
const RESET_TOKEN_EXPIRY_HOURS = 1;

// ── Helpers ───────────────────────────────────────────────────────────────────

const signJwt = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  });

const futureDate = (hours) =>
  new Date(Date.now() + hours * 60 * 60 * 1000);

// ── Register ──────────────────────────────────────────────────────────────────

export const register = async ({ prn, name, email, password }) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { prn }] },
  });

  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "PRN";
    const error = new Error(`${field} is already registered.`);
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationToken = generateToken();

  const user = await prisma.user.create({
    data: {
      prn,
      name,
      email,
      password: hashedPassword,
      email_verification_tokens: {
        create: {
          token: verificationToken,
          expires_at: futureDate(EMAIL_TOKEN_EXPIRY_HOURS),
        },
      },
    },
    select: {
      id: true,
      prn: true,
      name: true,
      email: true,
      role: true,
      is_verified: true,
    },
  });

  await sendVerificationEmail(email, name, verificationToken);

  return {
    user,
    message:
      "Registration successful. Please check your email to verify your account.",
  };
};

// ── Verify Email ──────────────────────────────────────────────────────────────

export const verifyEmail = async (token) => {
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    const error = new Error("Invalid verification token.");
    error.statusCode = 400;
    throw error;
  }

  if (record.is_used) {
    const error = new Error("Token has already been used.");
    error.statusCode = 400;
    throw error;
  }

  if (new Date() > record.expires_at) {
    const error = new Error(
      "Verification token has expired. Please request a new one."
    );
    error.statusCode = 410;
    throw error;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.user_id },
      data: { is_verified: true },
    }),
    prisma.emailVerificationToken.update({
      where: { token },
      data: { is_used: true },
    }),
  ]);

  return { message: "Email verified successfully. You can now log in." };
};

// ── Resend Verification ───────────────────────────────────────────────────────

export const resendVerification = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      message: "If that email exists, a new verification link has been sent.",
    };
  }

  if (user.is_verified) {
    const error = new Error("Account is already verified.");
    error.statusCode = 400;
    throw error;
  }

  // Invalidate all existing unused tokens
  await prisma.emailVerificationToken.updateMany({
    where: { user_id: user.id, is_used: false },
    data: { is_used: true },
  });

  const newToken = generateToken();

  await prisma.emailVerificationToken.create({
    data: {
      user_id: user.id,
      token: newToken,
      expires_at: futureDate(EMAIL_TOKEN_EXPIRY_HOURS),
    },
  });

  await sendVerificationEmail(email, user.name, newToken);

  return {
    message: "If that email exists, a new verification link has been sent.",
  };
};

// ── Login ─────────────────────────────────────────────────────────────────────

export const login = async ({ prn, password }) => {
  const user = await prisma.user.findUnique({ where: { prn } });

  if (!user) {
    const error = new Error("Invalid PRN or password.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid PRN or password.");
    error.statusCode = 401;
    throw error;
  }

  if (!user.is_verified) {
    const error = new Error(
      "Email not verified. Please check your inbox."
    );
    error.statusCode = 403;
    throw error;
  }

  const token = signJwt(user.id, user.role);
  const { password: _pw, ...safeUser } = user;

  return { user: safeUser, token };
};

// ── Get Me ────────────────────────────────────────────────────────────────────

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      prn: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      xp: true,
      level: true,
      global_rank: true,
      is_verified: true,
      created_at: true,
    },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// ── Forgot Password ───────────────────────────────────────────────────────────

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "If that email exists, a reset link has been sent." };
  }

  // Invalidate existing reset tokens
  await prisma.passwordResetToken.updateMany({
    where: { user_id: user.id, is_used: false },
    data: { is_used: true },
  });

  const resetToken = generateToken();

  await prisma.passwordResetToken.create({
    data: {
      user_id: user.id,
      token: resetToken,
      expires_at: futureDate(RESET_TOKEN_EXPIRY_HOURS),
    },
  });

  await sendPasswordResetEmail(email, user.name, resetToken);

  return { message: "If that email exists, a reset link has been sent." };
};

// ── Reset Password ────────────────────────────────────────────────────────────

export const resetPassword = async ({ token, newPassword }) => {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.is_used) {
    const error = new Error("Invalid or already-used reset token.");
    error.statusCode = 400;
    throw error;
  }

  if (new Date() > record.expires_at) {
    const error = new Error(
      "Reset token has expired. Please request a new one."
    );
    error.statusCode = 410;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.user_id },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { token },
      data: { is_used: true },
    }),
  ]);

  return {
    message:
      "Password reset successful. You can now log in with your new password.",
  };
};
