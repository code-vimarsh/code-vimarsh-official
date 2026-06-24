import { ZodError } from "zod";

/**
 * Validates req.body against a Zod schema.
 * Returns a 400 with formatted errors on failure.
 * @param {import("zod").ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res
        .status(400)
        .json({ success: false, message: "Validation failed.", errors });
    }
    next(err);
  }
};
