import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

/**
 * Verifies the Bearer JWT from the Authorization header.
 * Attaches the full user record to req.user on success.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Access token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found. Token invalid." });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your account first.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
