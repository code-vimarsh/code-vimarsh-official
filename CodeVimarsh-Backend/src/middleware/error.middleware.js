/**
 * Global error handling middleware.
 * Must be registered LAST in app.js (after all routes).
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    const field = err.meta?.target?.join(", ") ?? "field";
    return res
      .status(409)
      .json({ success: false, message: `Duplicate value for: ${field}.` });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res
      .status(404)
      .json({ success: false, message: "Record not found." });
  }

  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error.";

  res.status(statusCode).json({ success: false, message });
};
