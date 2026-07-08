import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  requireSuperAdmin,
  requireContentAdmin,
} from "../../middleware/role.middleware.js";

const router = Router();

// All admin routes require a valid JWT
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin user management
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users with roles (CONTENT_ADMIN and above)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of all users
 *       403:
 *         description: Forbidden
 */
router.get("/users", requireContentAdmin, adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}:
 *   get:
 *     summary: View a user's full profile (CONTENT_ADMIN and above)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full user profile with admin data
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", requireContentAdmin, adminController.getUserProfile);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   patch:
 *     summary: Change a user's role (SUPER_ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, CONTENT_ADMIN, SUPER_ADMIN]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Forbidden – SUPER_ADMIN only
 */
router.patch(
  "/users/:userId/role",
  requireSuperAdmin,
  adminController.changeUserRole
);

export default router;