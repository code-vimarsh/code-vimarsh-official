import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ── Read limits from env (falls back to 200 KB if not set) ───────────────────
const MAX_SIZE_KB = parseInt(process.env.MAX_AVATAR_SIZE_KB ?? "200", 10);
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

/**
 * Cloudinary storage engine for multer.
 * - Stores avatars under the "avatars/" folder in Cloudinary.
 * - Applies a 400×400 fill crop centered on the face at upload time.
 * - Only allows JPEG and PNG formats.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    // Derive a safe public_id from the original filename (strip extension)
    const name = file.originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_");
    return {
      folder: "code-vimarsh/users/avatars",
      public_id: `${Date.now()}_${name}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
      ],
    };
  },
});

/**
 * Filter — only accept image/* MIME types.
 * Rejects non-image files before they consume bandwidth.
 */
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const err = new Error("Only image files (JPEG, PNG, WebP) are allowed.");
    err.statusCode = 400;
    cb(err, false);
  }
};

/**
 * Multer instance configured for single avatar uploads.
 * - Field name expected from the frontend: "avatar"
 * - Hard limit: MAX_AVATAR_SIZE_KB (env-controlled, default 200 KB)
 */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

/**
 * Middleware: handles single "avatar" field upload.
 * Wraps multer to convert its errors into our standard error shape
 * so the global error middleware can render them cleanly.
 */
export const uploadAvatar = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (!err) return next();

    // Multer file-size error
    if (err.code === "LIMIT_FILE_SIZE") {
      const error = new Error(
        `Image size exceeds the ${MAX_SIZE_KB} KB limit. Please upload a smaller file.`
      );
      error.statusCode = 400;
      return next(error);
    }

    // Any other multer / cloudinary error
    err.statusCode = err.statusCode ?? 400;
    return next(err);
  });
};
