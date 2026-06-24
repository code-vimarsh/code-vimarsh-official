import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateProfileSchema, adminUpdateUserSchema } from "./user.schema.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middleware/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /users/leaderboard:
 *   get:
 *     summary: Get the global XP leaderboard (top 50)
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: Leaderboard fetched successfully
 */
router.get("/leaderboard", userController.getLeaderboard);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user's public profile
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's profile (owner or SUPER_ADMIN only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       403:
 *         description: Forbidden
 */

router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    const schema =
      req.user.role === "SUPER_ADMIN"
        ? adminUpdateUserSchema
        : updateProfileSchema;
    return validate(schema)(req, res, next);
  },
  userController.updateUserById,
);

/**
 * @swagger
 * /users/me/avatar:
 *   patch:
 *     summary: Upload or replace the logged-in user's profile avatar
 *     description: >
 *       Accepts a multipart/form-data request with an image file in the "avatar" field.
 *       No user ID is required — it is automatically extracted from the JWT token.
 *       The image is validated (size ≤ MAX_AVATAR_SIZE_KB, image/* MIME only),
 *       resized to 400×400 px with a face-centered fill crop, uploaded to Cloudinary,
 *       and the resulting secure URL is saved to the users table.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, or WebP; max 200 KB)
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   description: Secure Cloudinary URL of the new avatar
 *       400:
 *         description: No file provided, wrong file type, or file too large
 *       401:
 *         description: Unauthorized — missing or invalid token
 */
router.patch(
  "/me/avatar",
  authenticate,
  uploadAvatarMiddleware,
  userController.uploadAvatar,
);

export default router;