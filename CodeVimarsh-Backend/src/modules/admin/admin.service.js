import prisma from "../../config/prisma.js";

const ASSIGNABLE_ROLES = ["USER", "CONTENT_ADMIN", "SUPER_ADMIN"];

//^ Default permission sets keyed by role
const ROLE_PERMISSIONS = {
  CONTENT_ADMIN: {
    can_manage_events: true,
    can_manage_projects: true,
    can_manage_blogs: true,
    can_manage_resources: true,
    can_manage_users: false,
    can_manage_achievements: true,
  },
  SUPER_ADMIN: {
    can_manage_events: true,
    can_manage_projects: true,
    can_manage_blogs: true,
    can_manage_resources: true,
    can_manage_users: true,
    can_manage_achievements: true,
  },
};

/**
 * Change a user's role. Only SUPER_ADMIN may call this.
 * Automatically syncs the Admin permissions record.
 */
export const changeUserRole = async (requesterId, targetUserId, newRole) => {
  if (!ASSIGNABLE_ROLES.includes(newRole)) {
    const error = new Error(
      `Invalid role. Allowed values: ${ASSIGNABLE_ROLES.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  if (requesterId === targetUserId) {
    const error = new Error("You cannot change your own role.");
    error.statusCode = 400;
    throw error;
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });

  if (!target) {
    const error = new Error("Target user not found.");
    error.statusCode = 404;
    throw error;
  }

  const isAdminRole = ["CONTENT_ADMIN", "SUPER_ADMIN"].includes(newRole);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    if (isAdminRole) {
      await tx.admin.upsert({
        where: { user_id: targetUserId },
        create: { user_id: targetUserId, ...ROLE_PERMISSIONS[newRole] },
        update: ROLE_PERMISSIONS[newRole],
      });
    } else {
      // Revoke admin record when demoting back to USER
      await tx.admin.deleteMany({ where: { user_id: targetUserId } });
    }
  });

  return { message: `User role updated to ${newRole} successfully.` };
};

/** List all users – paginated (CONTENT_ADMIN and above) */
export const getAllUsers = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        prn: true,
        name: true,
        email: true,
        role: true,
        is_verified: true,
        xp: true,
        created_at: true,
        admin: true,
      },
    }),
    prisma.user.count(),
  ]);

  return { users, total, page, limit };
};

/** View one user's full admin-level profile */
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      admin: true,
      certificates: { include: { event: true } },
    },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const { password: _pw, ...safeUser } = user;
  return safeUser;
};