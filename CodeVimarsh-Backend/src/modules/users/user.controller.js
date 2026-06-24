import * as userService from "./user.service.js";

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const user = await userService.updateUserById(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await userService.getLeaderboard();
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /users/me/avatar
 * Uploads a new avatar image to Cloudinary and stores the resulting URL
 * in the users table.
 *
 * No user ID is needed in the URL — the logged-in user's ID is read
 * automatically from the JWT token (req.user.id set by authenticate middleware).
 *
 * This controller runs AFTER upload.middleware has already:
 *   1. Checked file size ≤ MAX_AVATAR_SIZE_KB
 *   2. Validated MIME type (image/* only)
 *   3. Uploaded the file to Cloudinary with a 400×400 face-crop transformation
 *   4. Set req.file with { path: secureUrl, filename: publicId }
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    // ── Guard: multer must have processed a file ──────────────────────────────
    if (!req.file) {
      const err = new Error(
        "No image file provided. Please attach an image with field name 'avatar'."
      );
      err.statusCode = 400;
      return next(err);
    }

    // User ID is always taken from the JWT token — never from URL params.
    // This guarantees a user can only ever update their own avatar.
    const userId   = req.user.id;
    const avatarUrl = req.file.path;     // Secure Cloudinary HTTPS URL
    const publicId  = req.file.filename; // Cloudinary public_id

    const updated = await userService.updateAvatar(userId, avatarUrl, publicId);

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      avatar: updated.avatar,
    });
  } catch (err) {
    next(err);
  }
};