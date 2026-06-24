import express from "express";
import { createContact } from "./contact.controller.js";

const router = express.Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit contact form
 *     description: Allows users to send a contact message to the system.
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               subject:
 *                 type: string
 *                 example: Inquiry about events
 *               message:
 *                 type: string
 *                 example: I would like to know more about your upcoming events.
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact form submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     message:
 *                       type: string
 *                       example: I would like to know more about your upcoming events.
 *                     subject:
 *                       type: string
 *                       example: Inquiry about events
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Name, email, and message are required
 *       500:
 *         description: Internal server error
 */
router.post("/", createContact);

export default router;
