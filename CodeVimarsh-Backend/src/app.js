import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import eventsRoutes from "./modules/events/events.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";

const app = express();

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── Swagger Docs ──────────────────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/events", eventsRoutes);
app.use("/api/v1/contact", contactRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Code Vimarsh API is running 🚀" });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

app.use(errorMiddleware);

export default app;
