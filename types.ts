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
}

export interface ProjectType {
  id: string;
  title: string;
  tech: string[];
  author: string;
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