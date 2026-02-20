import { NavItem, EventType, ProjectType, AchievementType, TeamMember, BlogPost } from './types';

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

export const MOCK_EVENTS: EventType[] = [
  { id: '1', title: 'Web3 & Beyond Hackathon', date: '2024-11-15', type: 'Upcoming', description: 'Build the future of decentralized applications.' },
  { id: '2', title: 'Advanced React Patterns Workshop', date: '2024-10-20', type: 'Past', description: 'Deep dive into hooks, context, and performance.' },
  { id: '3', title: 'Open Source Contribution Sprint', date: 'Now', type: 'Live', description: 'Join us in making your first PR to major repos.' },
];

export const MOCK_PROJECTS: ProjectType[] = [
  { id: '1', title: 'Vimarsh OS', tech: ['Rust', 'C', 'Assembly'], author: 'System Group', links: { github: '#' } },
  { id: '2', title: 'Campus Connect App', tech: ['React Native', 'Node.js', 'PostgreSQL'], author: 'App Dev Team', links: { live: '#' } },
  { id: '3', title: 'AI Study Assistant', tech: ['Python', 'TensorFlow', 'FastAPI'], author: 'AI/ML Cohort', links: { github: '#' } },
];

export const MOCK_ACHIEVEMENTS: AchievementType[] = [
  { id: '1', year: '2024', title: 'Smart India Hackathon Winners', description: 'Secured 1st prize in the software edition.', category: 'Hackathon' },
  { id: '2', year: '2023', title: '100+ PRs in Hacktoberfest', description: 'Club milestone reached in a single month.', category: 'Open Source' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Aarav Patel', role: 'President & Tech Lead', image: 'https://picsum.photos/400/400?random=1' },
  { id: '2', name: 'Priya Sharma', role: 'Vice President', image: 'https://picsum.photos/400/400?random=2' },
  { id: '3', name: 'Rahul Desai', role: 'Open Source Head', image: 'https://picsum.photos/400/400?random=3' },
  { id: '4', name: 'Neha Gupta', role: 'Design Lead', image: 'https://picsum.photos/400/400?random=4' },
];

export const MOCK_BLOGS: BlogPost[] = [
  { id: '1', title: 'Building Scalable Systems with Go', excerpt: 'Learn how we migrated our backend services to handle 10x traffic.', date: 'Oct 12, 2024', author: 'Aarav Patel', tags: ['Backend', 'Go'] },
  { id: '2', title: 'Demystifying WebGL and Three.js', excerpt: 'A beginner-friendly guide to rendering 3D graphics on the web.', date: 'Sep 28, 2024', author: 'Neha Gupta', tags: ['Frontend', '3D'] },
];