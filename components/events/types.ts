// ─── Event domain types ───────────────────────────────────────────────────────
// All backend integration points are clearly typed.
// Swap `eventsData.ts` with real API calls to enable full CRUD later.

export type EventStatus = 'upcoming' | 'live' | 'past';

export type FilterTab = 'All' | 'Upcoming' | 'Live' | 'Past';

export interface Speaker {
  id: string;
  name: string;
  title: string;
  avatar?: string; // URL or initials fallback
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  /** Short blurb shown on the card (max ~120 chars) */
  description: string;
  /** Full markdown-safe description shown in the modal */
  fullDescription: string;
  /** ISO-8601 date string for sorting: "2026-03-15" | "live" */
  date: string;
  /** Human-readable date/time for display */
  displayDate: string;
  time?: string;
  location: string;
  venue?: string;
  status: EventStatus;
  /** Banner/thumbnail image URL */
  image?: string;
  /** Gallery: multiple images (first used as banner fallback) */
  images?: string[];
  tags?: string[];
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
  /** Only relevant for live events */
  registrationLink?: string;
  capacity?: number;
  registeredCount?: number;
}
