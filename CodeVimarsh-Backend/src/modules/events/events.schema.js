import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string({ required_error: "Title is required." }).min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  long_description: z.string().optional(),
  type: z.enum(["Workshop", "Hackathon", "Meetup"], { required_error: "Event type is required." }),
  location: z.string().optional(),
  start_date: z.string({ required_error: "Start date is required." }).datetime("Invalid datetime format."),
  end_date: z.string().datetime("Invalid datetime format.").optional(),
  max_participants: z.number().int().positive().optional(),
  banner_image: z.string().url("Must be a valid URL.").optional(),
  topics: z.array(z.string()).default([]),
});

export const updateEventSchema = createEventSchema.partial();

export const registerEventSchema = z.object({
  whatsapp_number: z.string({ required_error: "WhatsApp number is required." }),
  github_username: z.string().optional(),
  experience_level: z.enum(["Beginner", "Intermediate", "Advanced"], { required_error: "Experience level is required." }),
  areas_of_interest: z.array(z.string()).default([]),
  reason_for_participation: z.string().optional(),
});

export const addEventSpeakerSchema = z.object({
  name: z.string({ required_error: "Speaker name is required." }).min(2, "Name must be at least 2 characters."),
  designation: z.string().optional(),
  avatar: z.string().url("Must be a valid URL.").optional(),
  bio: z.string().optional(),
});
export const updateEventSpeakerSchema = addEventSpeakerSchema.partial();
