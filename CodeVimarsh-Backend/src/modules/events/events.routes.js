import { Router } from "express";
import * as eventsController from "./events.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireSuperAdmin } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createEventSchema,
  updateEventSchema,
  registerEventSchema,
  addEventSpeakerSchema,
  updateEventSpeakerSchema,
} from "./events.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management & registration
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", eventsController.getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 event:
 *                   type: object
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Event not found
 */
router.get("/:id", eventsController.getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
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
 *               - type
 *               - start_date
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Introduction to Open Source
 *               description:
 *                 type: string
 *                 example: A beginner-friendly session on contributing to open source.
 *               long_description:
 *                 type: string
 *                 example: This workshop covers forking, branching, PRs, and more.
 *               type:
 *                 type: string
 *                 enum: [Workshop, Hackathon, Meetup]
 *                 example: Workshop
 *               location:
 *                 type: string
 *                 example: Lab 3, MSUB Campus
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-10T10:00:00.000Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-10T13:00:00.000Z"
 *               max_participants:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *               banner_image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/banner.png
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: []
 *                 example: [Git, GitHub, Open Source]
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 event:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – SUPER_ADMIN only
 */
router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  validate(createEventSchema),
  eventsController.createEvent
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
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
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Updated Event Title
 *               description:
 *                 type: string
 *                 example: Updated description.
 *               long_description:
 *                 type: string
 *                 example: Updated long description.
 *               type:
 *                 type: string
 *                 enum: [Workshop, Hackathon, Meetup]
 *                 example: Hackathon
 *               location:
 *                 type: string
 *                 example: Auditorium, MSUB Campus
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-15T09:00:00.000Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-15T17:00:00.000Z"
 *               max_participants:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               banner_image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/new-banner.png
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [DSA, Web Dev]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 event:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – SUPER_ADMIN only
 *       404:
 *         description: Event not found
 */
router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  validate(updateEventSchema),
  eventsController.updateEvent
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
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
 *                   example: Event deleted successfully.
 *                 event:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – SUPER_ADMIN only
 *       404:
 *         description: Event not found
 */
router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  eventsController.deleteEvent
);

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
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
 *             required:
 *               - whatsapp_number
 *               - experience_level
 *             properties:
 *               whatsapp_number:
 *                 type: string
 *                 example: "9876543210"
 *               github_username:
 *                 type: string
 *                 example: johndoe
 *               experience_level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: Beginner
 *               areas_of_interest:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: []
 *                 example: [Web Dev, AI/ML]
 *               reason_for_participation:
 *                 type: string
 *                 example: I want to improve my competitive programming skills.
 *     responses:
 *       201:
 *         description: Successfully registered for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 registration:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: Successfully registered! A confirmation email has been sent.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Event not found
 *       409:
 *         description: Already registered for this event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You are already registered for this event.
 */
router.post(
  "/:id/register",
  authenticate,
  validate(registerEventSchema),
  eventsController.registerForEvent
);

/**
 * @swagger
 * /events/{id}/speakers:
 *   post:
 *     summary: Add a speaker to an event
 *     tags: [Events]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               designation:
 *                 type: string
 *                 example: "Software Engineer"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.png"
 *               bio:
 *                 type: string
 *                 example: "Expert in Node.js"
 *     responses:
 *       201:
 *         description: Successfully added speaker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 speaker:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: Speaker added successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – SUPER_ADMIN only
 *       404:
 *         description: Event not found
 */
router.post(
  "/:id/speakers",
  authenticate,
  requireSuperAdmin,
  validate(addEventSpeakerSchema),
  eventsController.addEventSpeaker
);

/**
 * @swagger
 * /events/speakers/{speakerId}:
 *   put:
 *     summary: Update an event speaker
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: speakerId
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
 *               designation:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated speaker
 *       404:
 *         description: Speaker not found
 */
router.put(
  "/speakers/:speakerId",
  authenticate,
  requireSuperAdmin,
  validate(updateEventSpeakerSchema),
  eventsController.updateEventSpeaker
);

/**
 * @swagger
 * /events/speakers/{speakerId}:
 *   delete:
 *     summary: Delete an event speaker
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: speakerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted speaker
 *       404:
 *         description: Speaker not found
 */
router.delete(
  "/speakers/:speakerId",
  authenticate,
  requireSuperAdmin,
  eventsController.deleteEventSpeaker
);

export default router;