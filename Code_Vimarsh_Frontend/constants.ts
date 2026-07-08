import { NavItem, EventType, ProjectType, AchievementType, TeamMember, BlogPost, ManagedBlog, ManagedAchievement, VideoResource, LinkResource, Alum } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Resources', path: '/resources' },
  { label: 'Projects', path: '/projects' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Blog', path: '/blog' },
  { label: 'Alumni', path: '/alumni' },
  { label: 'Team', path: '/team' },
  { label: 'Contact', path: '/contact' },
];

export const MOCK_EVENTS: EventType[] = [];
export const MOCK_PROJECTS: ProjectType[] = [];
export const MOCK_ACHIEVEMENTS: AchievementType[] = [];
export const MOCK_MANAGED_ACHIEVEMENTS: ManagedAchievement[] = [];
export const MOCK_TEAM: TeamMember[] = [];
export const MOCK_BLOGS: BlogPost[] = [];
export const MOCK_MANAGED_BLOGS: ManagedBlog[] = [];
export const MOCK_VIDEOS: VideoResource[] = [];
export const MOCK_LINKS: LinkResource[] = [];
export const MOCK_ALUMNI: Alum[] = [];