import prisma from "../../config/prisma.js";
import cloudinary from "../../config/cloudinary.js";

const PUBLIC_USER_SELECT = {
  id: true,
  prn: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  xp: true,
  level: true,
  global_rank: true,
  github_url: true,
  linkedin_url: true,
  leetcode_url: true,
  created_at: true,
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUserById = async (requesterId, targetId, data) => {
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
  });

  if (requesterId !== targetId && requester.role !== "SUPER_ADMIN") {
    const error = new Error("You are not allowed to update this profile.");
    error.statusCode = 403;
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data,
    select: PUBLIC_USER_SELECT,
  });

  return updated;
};

/**
 * Upload a new avatar URL to the users table.
 * Only the owner of the account can call this (enforced in controller).
 * If the user already has an avatar stored in Cloudinary, the old asset
 * is deleted from Cloudinary before writing the new URL to keep storage clean.
 *
 * @param {string} userId       - Target user's id
 * @param {string} avatarUrl    - Secure Cloudinary URL returned by multer-storage-cloudinary
 * @param {string} publicId     - Cloudinary public_id of the newly uploaded asset
 * @returns {Promise<{id, avatar}>}
 */
export const updateAvatar = async (userId, avatarUrl, publicId) => {
  // ── Fetch existing avatar public_id from DB if present ────────────────────
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  // If there is a previous Cloudinary avatar, delete it to avoid orphaned assets.
  // We detect Cloudinary URLs by checking the domain.
  if (existing?.avatar && existing.avatar.includes("res.cloudinary.com")) {
    try {
      // Extract public_id from the old URL — matches the full nested path without extension
      // e.g. "code-vimarsh/users/avatars/1710520000000_john" from the Cloudinary URL
      const match = existing.avatar.match(/code-vimarsh\/users\/avatars\/([^.]+)/);
      if (match?.[1]) {
        await cloudinary.uploader.destroy(`code-vimarsh/users/avatars/${match[1]}`);
      }
    } catch {
      // Non-fatal — log and continue even if old asset deletion fails
      console.warn("[Avatar] Could not delete old Cloudinary asset:", existing.avatar);
    }
  }

  // ── Write new avatar URL to the database ─────────────────────────────────
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: { id: true, avatar: true },
  });

  return updated;
};

export const getLeaderboard = async () =>
  prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { xp: "desc" },
    take: 50,
    select: {
      id: true,
      prn: true,
      name: true,
      avatar: true,
      xp: true,
      level: true,
      global_rank: true,
    },
  });