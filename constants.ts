import { NavItem, EventType, ProjectType, AchievementType, TeamMember, BlogPost, VideoResource, LinkResource } from './types';

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

export const MOCK_VIDEOS: VideoResource[] = [
  {
    id: "java-full",
    title: "Java Full Course (Beginner to Advanced)",
    category: "youtube",
    url: "https://youtu.be/eIrMbAQSU34?si=6fk454xxKQu_ta-g",
    thumbnail: "https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg",
    tags: ["Java", "Beginner", "OOP"]
  },
  {
    id: "c-full",
    title: "C Programming Full Course",
    category: "youtube",
    url: "https://youtu.be/rQoqCP7LX60?si=ldtuSiE543obcHa3",
    thumbnail: "https://img.youtube.com/vi/rQoqCP7LX60/maxresdefault.jpg",
    tags: ["C Language", "Basics", "Programming"]
  },
  {
    id: "python-full",
    title: "Python Full Course",
    category: "youtube",
    url: "https://youtu.be/UrsmFxEIp5k?si=YncVWzSPAXW0Ku5S",
    thumbnail: "https://img.youtube.com/vi/UrsmFxEIp5k/maxresdefault.jpg",
    tags: ["Python", "Beginner", "Programming"]
  },
  {
    id: "dsa-series",
    title: "Complete DSA Series",
    category: "youtube",
    url: "https://youtu.be/VTLCoHnyACE?si=hPPA-4nphOFHuY5J",
    thumbnail: "https://img.youtube.com/vi/VTLCoHnyACE/maxresdefault.jpg",
    tags: ["DSA", "Algorithms", "Problem Solving"]
  },
  {
    id: "cpp-full",
    title: "C++ Full Course",
    category: "youtube",
    url: "https://youtu.be/e7sAf4SbS_g?si=v_hQalT02OZIJN5K",
    thumbnail: "https://img.youtube.com/vi/e7sAf4SbS_g/maxresdefault.jpg",
    tags: ["C++", "OOP", "Placement Prep"]
  }
];

export const MOCK_LINKS: LinkResource[] = [
  {
    id: '6',
    title: "Striver's SDE Sheet (Take U Forward)",
    category: 'website',
    url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
    tags: ['Curated', 'Video Support'],
    bestFor: 'Complete roadmap from basics to advanced',
    contentType: 'Curated sheet + Video support'
  },
  {
    id: '7',
    title: "Love Babbar DSA 450 Sheet",
    category: 'website',
    url: 'https://450dsa.com/',
    tags: ['Topic-wise', 'Checklist'],
    bestFor: 'Fixed checklist style revision',
    contentType: 'Topic-wise categorized list'
  },
  {
    id: '8',
    title: "NeetCode 150",
    category: 'website',
    url: 'https://neetcode.io/practice',
    tags: ['Patterns', 'LeetCode'],
    bestFor: 'LeetCode-pattern mastery',
    contentType: 'Patterns like DP, Graphs, Trees'
  },
  {
    id: '9',
    title: "Blind 75",
    category: 'website',
    url: 'https://www.teamblind.com/post/Blind-75-LeetCode-Questions-8pdhm1h2',
    tags: ['FAANG', 'Fast Prep'],
    bestFor: 'Fastest FAANG-style prep',
    contentType: 'Only the most asked 75 questions'
  },
  {
    id: '10',
    title: "LeetCode Study Plans",
    category: 'website',
    url: 'https://leetcode.com/study-plan/',
    tags: ['Structured', 'Daily Practice'],
    bestFor: 'Guided daily structured practice',
    contentType: 'Arrays, DP, SQL, Graphs tracks'
  },
  {
    id: '11',
    title: "InterviewBit Programming Path",
    category: 'website',
    url: 'https://www.interviewbit.com/coding-interview-questions/',
    tags: ['Competitive', 'Gamified'],
    bestFor: 'Competitive interview-oriented prep',
    contentType: 'Level progression + hints'
  },
  {
    id: '12',
    title: "GeeksforGeeks DSA Must-Do",
    category: 'website',
    url: 'https://www.geeksforgeeks.org/must-do-coding-questions-for-product-based-companies/',
    tags: ['Topic-wise', 'Explanations'],
    bestFor: 'Topic explanation + questions',
    contentType: 'Beginner-friendly'
  },
  {
    id: '13',
    title: "Coding Ninjas Guided Paths",
    category: 'website',
    url: 'https://www.codingninjas.com/codestudio/guided-paths',
    tags: ['Structured', 'Incremental'],
    bestFor: 'Topic-wise structured lists',
    contentType: 'Incremental difficulty'
  },
  {
    id: '14',
    title: "CS50 Harvard Problem Sets",
    category: 'website',
    url: 'https://cs50.harvard.edu/x/2024/psets/',
    tags: ['Logic', 'Fundamentals'],
    bestFor: 'Logic + fundamentals',
    contentType: 'Strong conceptual base'
  },
  {
    id: '15',
    title: "AlgoExpert",
    category: 'website',
    url: 'https://www.algoexpert.io/',
    tags: ['Premium', 'System Design'],
    bestFor: 'Premium polished explanations',
    contentType: 'Coding + system design'
  },
];