import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authLimiter } from "../../middleware/rateLimit.middleware.js";
import {
  registerSchema,
  loginSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & email verification
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new student account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prn, name, email, password]
 *             properties:
 *               prn:
 *                 type: string
 *                 example: "8022004011"
 *               name:
 *                 type: string
 *                 example: "Magnus Carlsen"
 *               email:
 *                 type: string
 *                 example: "magnus@gmail.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass@123"
 *     responses:
 *       201:
 *         description: Registration successful – verification email sent
 *       409:
 *         description: Email or PRN already registered
 */
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with PRN and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prn, password]
 *             properties:
 *               prn:
 *                 type: string
 *                 example: "8022004011"
 *               password:
 *                 type: string
 *                 example: "SecurePass@123"
 *     responses:
 *       200:
 *         description: Login successful – returns JWT token
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
router.post("/login", authLimiter, validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify email via token link
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or already-used token
 *       410:
 *         description: Token expired
 */
router.get("/verify-email", authController.verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "magnus@gmail.com"
 *     responses:
 *       200:
 *         description: Verification email resent (if account exists)
 */
router.post(
  "/resend-verification",
  authLimiter,
  validate(resendVerificationSchema),
  authController.resendVerification,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, authController.getMe);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link via email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent (if account exists)
 */
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using the reset token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token
 *       410:
 *         description: Token expired
 */
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
