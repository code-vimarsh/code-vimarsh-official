import express from "express";

import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController
} from "./project.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createProjectSchema,
  updateProjectSchema
} from "./project.schema.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project showcase management APIs
 */


/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - tech_stack
 *             properties:
 *               title:
 *                 type: string
 *                 example: AI Resume Analyzer
 *               short_description:
 *                 type: string
 *                 example: AI powered resume screening tool
 *               category:
 *                 type: string
 *                 example: AI
 *               about:
 *                 type: string
 *                 example: This project analyzes resumes using NLP techniques.
 *               key_features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Resume Parsing", "Skill Extraction"]
 *               tech_stack:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Node.js", "React", "OpenAI"]
 *               github_link:
 *                 type: string
 *                 example: https://github.com/user/project
 *               image:
 *                 type: string
 *                 example: https://image-url.com/project.png
 *               author_name:
 *                 type: string
 *                 example: Dhruv Pathak
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user_id_1", "user_id_2"]
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post(
  "/",
  authenticate,
  validate(createProjectSchema),
  createProjectController
);


/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all approved projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 */
router.get("/", getProjectsController);


/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project details by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details retrieved
 *       404:
 *         description: Project not found
 */
router.get("/:id", getProjectController);


/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               short_description:
 *                 type: string
 *               category:
 *                 type: string
 *               about:
 *                 type: string
 *               key_features:
 *                 type: array
 *                 items:
 *                   type: string
 *               tech_stack:
 *                 type: array
 *                 items:
 *                   type: string
 *               github_link:
 *                 type: string
 *               image:
 *                 type: string
 *               author_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put(
  "/:id",
  authenticate,
  validate(updateProjectSchema),
  updateProjectController
);


/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete(
  "/:id",
  authenticate,
  deleteProjectController
);

export default router;