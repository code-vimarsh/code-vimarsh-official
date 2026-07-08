/**
 * Role hierarchy (ascending privilege):
 *   USER  <  CONTENT_ADMIN  <  SUPER_ADMIN
 *
 * Usage examples:
 *   router.delete("/route", authenticate, requireRole("SUPER_ADMIN"), handler)
 *   router.get("/route",    authenticate, requireContentAdmin, handler)
 */

const ROLE_HIERARCHY = {
  USER: 0,
  CONTENT_ADMIN: 1,
  SUPER_ADMIN: 2,
};

/**
 * Allows access if the authenticated user's role is >= minimumRole in hierarchy.
 * @param {keyof typeof ROLE_HIERARCHY} minimumRole
 */
export const requireRole = (minimumRole) => (req, res, next) => {
  const userLevel = ROLE_HIERARCHY[req.user?.role] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] ?? Infinity;

  if (userLevel < requiredLevel) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${minimumRole} or higher.`,
    });
  }

  next();
};

/**
 * Allows access only if the user has one of the listed exact roles.
 * @param {Array<keyof typeof ROLE_HIERARCHY>} roles
 */
export const requireAnyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Allowed roles: ${roles.join(", ")}.`,
    });
  }
  next();
};

// ── Convenience guards ────────────────────────────────────────────────────────

/** SUPER_ADMIN only */
export const requireSuperAdmin = requireRole("SUPER_ADMIN");

/** CONTENT_ADMIN and above */
export const requireContentAdmin = requireRole("CONTENT_ADMIN");