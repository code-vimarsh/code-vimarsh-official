import { randomBytes } from "crypto";

/**
 * Generates a cryptographically secure random hex token.
 * @param {number} bytes - Number of random bytes (default 32)
 * @returns {string} Hex token string
 */
export const generateToken = (bytes = 32) =>
  randomBytes(bytes).toString("hex");
