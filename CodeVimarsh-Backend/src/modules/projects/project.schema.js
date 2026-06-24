// adding validations to the projects table
import { z } from "zod";

export const createProjectSchema = z.object({

  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  short_description: z
    .string()
    .min(10)
    .optional(),

  category: z.enum([
    "Web",
    "AI",
    "Blockchain",
    "App",
    "Other"
  ]).optional(),

  about: z.string().optional(),

  key_features: z
    .array(z.string())
    .optional(),

  tech_stack: z
    .array(z.string())
    .min(1, "At least one technology required"),

  github_link: z
    .string()
    .url("Invalid GitHub URL")
    .optional(),

  image: z.string().optional(),

  author_name: z.string().min(1, "Author name is required"),

  members: z
    .array(z.string())
    .optional()

});

// updating project schema

export const updateProjectSchema = z.object({

  title: z.string().optional(),

  short_description: z.string().optional(),

  category: z.enum([
    "Web",
    "AI",
    "Blockchain",
    "App",
    "Other"
  ]).optional(),

  about: z.string().optional(),

  key_features: z.array(z.string()).optional(),

  tech_stack: z.array(z.string()).optional(),

  github_link: z.string().url().optional(),

  image: z.string().optional(),

  author_name: z.string().optional()

});


export const projectIdSchema = z.object({
  id: z.string()
});