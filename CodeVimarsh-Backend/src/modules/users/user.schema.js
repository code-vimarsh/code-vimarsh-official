import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url("Invalid URL for avatar.").optional(),
  github_url: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  leetcode_url: z.string().url("Invalid LeetCode URL").optional().or(z.literal("")),
}).strict();

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url("Invalid URL for avatar.").optional(),
  github_url: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  leetcode_url: z.string().url("Invalid LeetCode URL").optional().or(z.literal("")),
  xp: z.number().int().min(0).optional(),
  level: z.number().int().min(1).optional(),
  circuit: z.number().int().min(0).optional(),
  is_verified: z.boolean().optional(),
}).strict();
