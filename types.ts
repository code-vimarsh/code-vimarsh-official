export interface NavItem {
  label: string;
  path: string;
}

export interface EventType {
  id: string;
  title: string;
  date: string;
  type: 'Upcoming' | 'Live' | 'Past';
  description: string;
  image?: string;
  /** Gallery: multiple images — first is used as banner when image is absent */
  images?: string[];
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;          // backward-compat short description
  shortDescription?: string;    // 2-3 line card preview
  fullDescription?: string;     // complete description shown when expanded
  features?: string[];          // bullet list of key features
  category: 'Web' | 'Mobile' | 'AI / ML' | 'Systems' | 'Open Source';
  tech: string[];
  author: string;
  image?: string;               // URL or base64 data URI (primary / legacy)
  images?: string[];            // gallery — multiple images (upload + URL)
  isPublished?: boolean;        // only published projects appear publicly
  links: {
    github?: string;
    live?: string;
  };
}

export interface AchievementType {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'Hackathon' | 'Research' | 'Open Source' | 'Recognition';
}

// ── Managed achievements for the admin CRUD system ────────────────────────────
export interface ManagedAchievement {
  id: string;
  title: string;
  description: string;
  date: string;           // display string e.g. "JAN 2022"
  tag: string;            // short label shown on the card
  icon: string;           // emoji string
  category: string;       // broader grouping
  order: number;          // 1-based position in the timeline
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  github?: string;
  linkedin?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
}

// ── Rich blog for the managed CMS system ─────────────────────────────────────
export type BlogTopic =
  | 'Web Development'
  | 'AI / ML'
  | 'DSA'
  | 'Hackathon'
  | 'Workshop'
  | 'Club Activity'
  | 'Announcement'
  | 'DevOps'
  | 'Mobile'
  | 'Open Source'
  | 'Other';

export type BlogStatus = 'Draft' | 'Published';

export type AuthorRole =
  | 'Core Member'
  | 'Lead'
  | 'Guest'
  | 'Alumni'
  | 'Faculty'
  | 'Admin';

export interface ManagedBlog {
  id: string;
  title: string;
  /** Admin-controlled, unique, hyphen-separated slug  */
  slug: string;
  topic: BlogTopic;
  /** 2-3 line preview shown on cards */
  shortDescription: string;
  /** Full markdown/plain content */
  content: string;
  /** Primary card image URL */
  featuredImage: string;
  /** Extra gallery images */
  images: string[];
  authorName: string;
  authorRole: AuthorRole;
  tags: string[];
  status: BlogStatus;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category?: string;
  tags?: string[];
}

export interface LinkResource {
  id: string;
  title: string;
  url: string;
  category: string;
  tags?: string[];
  bestFor?: string;
  contentType?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'youtube' | 'website';
  url: string;
  thumbnail?: string;
  tags: string[];
  bestFor?: string;
  contentType?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Content Admin' | 'Moderator';
  addedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  eventId: string;       // which event they registered for
  eventTitle: string;    // denormalized for display
  registeredAt: string;
}

export interface ClubMember {
  id: string;
  name: string;
  email: string;
  role: string;          // e.g. "Member", "Core Team", "Alumni"
  joinedAt: string;
}

export type CertType = 'Participation' | 'Completion' | 'Winner' | 'Merit';
export type CertificateTemplate = 'Nexus' | 'Signature' | 'Minimal' | 'Academic' | 'Cyber' | 'Creative' | 'Vintage' | 'Corporate' | 'Royal' | 'Space' | 'Eco' | 'Geometric';

export interface CertificateData {
  recipientName: string;
  eventName: string;
  certType: CertType;
  date: string;
  issuedBy: string;
  description: string;
  templateId?: CertificateTemplate;
  themeColor?: string; // Hex color for custom design variations
}