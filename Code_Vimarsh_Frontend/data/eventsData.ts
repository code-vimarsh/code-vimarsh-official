/**
 * eventsData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock event data for Code Vimarsh – frontend-only simulation.
 *
 * BACKEND INTEGRATION GUIDE:
 *  • Replace this file's export with an API hook (e.g. useQuery / SWR / fetch).
 *  • The shape of each object must match the `Event` interface in `./types.ts`.
 *  • CRUD endpoints expected:
 *      GET    /api/events          → Event[]
 *      GET    /api/events/:id      → Event
 *      POST   /api/events          → Event    (admin only)
 *      PUT    /api/events/:id      → Event    (admin only)
 *      DELETE /api/events/:id      → void     (admin only)
 */

import type { Event } from '../components/events/types';

export const EVENTS_DATA: Event[] = [
  // ─── LIVE ──────────────────────────────────────────────────────────────────
  {
    id: 'evt-001',
    title: 'Open Source Contribution Sprint',
    description:
      'Submit your first Pull Request to major open-source repositories — guided by mentors in real time.',
    fullDescription:
      'The Code Vimarsh Open Source Sprint is a live, moderated session where participants pick issues from popular GitHub repositories and get mentored through their first (or tenth!) pull request. Whether you are new to git or an experienced contributor, our mentor panel will help you navigate code reviews, CI checks, and community guidelines. Walk away with merged PRs, new connections, and a sharper open-source instinct.',
    date: 'live',
    displayDate: 'Happening Now',
    time: 'All day',
    location: 'Online · Discord + GitHub',
    venue: 'Code Vimarsh Discord Server',
    status: 'live',
    image:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
    tags: ['Open Source', 'GitHub', 'Mentorship', 'Beginner-Friendly'],
    registrationLink: 'https://discord.gg/codevimarsh',
    capacity: 200,
    registeredCount: 142,
    speakers: [
      { id: 's1', name: 'Aryan Buha', title: 'Core Lead, Code Vimarsh' },
      { id: 's2', name: 'Priya Mehta', title: 'Open Source Maintainer @ CNCF' },
    ],
    schedule: [
      { time: '10:00 AM', title: 'Kickoff & Issue Hunt', description: 'Find beginner-friendly issues on GitHub.' },
      { time: '11:30 AM', title: 'Mentor Pairing Session', description: 'Get assigned a mentor for your chosen repo.' },
      { time: '02:00 PM', title: 'PR Review Circle', description: 'Live code reviews and feedback.' },
      { time: '04:30 PM', title: 'Wrap-Up & Certificates', description: 'Merged PR showcase & digital certificates.' },
    ],
  },

  // ─── UPCOMING ──────────────────────────────────────────────────────────────
  {
    id: 'evt-002',
    title: 'Web3 & Beyond Hackathon',
    description:
      'Build the future of decentralised applications over 36 hours alongside fellow developers from across Gujarat.',
    fullDescription:
      'Web3 & Beyond is Code Vimarsh\'s flagship annual hackathon focused on blockchain, DeFi, and decentralised identity. Teams of 2–4 will compete across three tracks: DeFi Protocols, NFT Utility Tools, and Web3 Social. A prize pool of ₹1,50,000 is up for grabs, with mentorship sessions from industry leaders and a live judging panel from Polygon, Filecoin, and WazirX.',
    date: '2026-03-28',
    displayDate: 'March 28–29, 2026',
    time: 'Starts 9:00 AM IST',
    location: 'MSU Baroda • IT Block',
    venue: 'Department of Computer Science, Faculty of Technology & Engineering, MSU',
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tags: ['Hackathon', 'Web3', 'Blockchain', '36 Hours', '₹1.5L Prize'],
    registrationLink: '',
    capacity: 150,
    registeredCount: 68,
    speakers: [
      { id: 's3', name: 'Rahul Joshi', title: 'Ecosystem Lead, Polygon Labs' },
      { id: 's4', name: 'Sneha Kapoor', title: 'DeFi Researcher, WazirX' },
      { id: 's5', name: 'Vivek Nair', title: 'Smart Contract Auditor' },
    ],
    schedule: [
      { time: 'Day 1 – 09:00', title: 'Inauguration & Problem Statement Drop' },
      { time: 'Day 1 – 10:30', title: 'Hacking Begins' },
      { time: 'Day 1 – 18:00', title: 'Mentor Office Hours (Round 1)' },
      { time: 'Day 2 – 08:00', title: 'Mentor Office Hours (Round 2)' },
      { time: 'Day 2 – 13:00', title: 'Submission Deadline' },
      { time: 'Day 2 – 15:00', title: 'Final Presentations & Judging' },
      { time: 'Day 2 – 17:30', title: 'Prize Distribution & Closing' },
    ],
  },
  {
    id: 'evt-003',
    title: 'System Design Masterclass',
    description:
      'Learn how to architect scalable distributed systems from engineers who\'ve built them at scale.',
    fullDescription:
      'A deep-dive workshop on designing systems that handle millions of users. Topics include load balancing, consistent hashing, CAP theorem trade-offs, database sharding, message queues, and designing for observability. Attendees will work through real-world case studies: designing WhatsApp, Netflix CDN, and a URL shortener from scratch. Certificate of completion provided.',
    date: '2026-04-12',
    displayDate: 'April 12, 2026',
    time: '2:00 PM – 6:00 PM IST',
    location: 'Online · Zoom',
    venue: 'Zoom Webinar (link sent on registration)',
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    tags: ['Workshop', 'System Design', 'Backend', 'Architecture'],
    registrationLink: '',
    capacity: 300,
    registeredCount: 211,
    speakers: [
      { id: 's6', name: 'Karan Shah', title: 'Staff Engineer, Zepto' },
      { id: 's7', name: 'Deepika Rao', title: 'Principal SWE, Swiggy' },
    ],
    schedule: [
      { time: '2:00 PM', title: 'Foundations of Distributed Systems' },
      { time: '3:00 PM', title: 'Case Study: Design WhatsApp' },
      { time: '4:00 PM', title: 'Break' },
      { time: '4:15 PM', title: 'Case Study: Design Netflix CDN' },
      { time: '5:15 PM', title: 'Live Q&A with Speakers' },
      { time: '5:50 PM', title: 'Wrap-Up & Resources' },
    ],
  },
  {
    id: 'evt-004',
    title: 'AI for Everyone – Prompt Engineering 101',
    description:
      'A hands-on intro to prompt engineering, LLMs, and building AI-powered mini-apps — no ML background needed.',
    fullDescription:
      'This beginner-friendly workshop demystifies AI and Large Language Models. Learn how to craft effective prompts, use chain-of-thought reasoning, build simple agents with LangChain, and integrate OpenAI/Gemini APIs into your apps. Participants leave with a functional AI mini-project.',
    date: '2026-05-03',
    displayDate: 'May 3, 2026',
    time: '11:00 AM – 3:00 PM IST',
    location: 'MSU Baroda • Seminar Hall B',
    venue: 'Seminar Hall B, Faculty of Technology, MSU Baroda',
    status: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
    tags: ['AI', 'LLMs', 'Prompt Engineering', 'Beginner-Friendly', 'Hands-On'],
    registrationLink: '',
    capacity: 120,
    registeredCount: 34,
    speakers: [
      { id: 's8', name: 'Ananya Desai', title: 'AI Developer Advocate, Google' },
    ],
    schedule: [
      { time: '11:00 AM', title: 'What are LLMs? A Visual Explainer' },
      { time: '12:00 PM', title: 'Crafting Effective Prompts' },
      { time: '01:00 PM', title: 'Lunch Break' },
      { time: '01:30 PM', title: 'Build Your First AI App (LangChain + Gemini)' },
      { time: '02:45 PM', title: 'Demo Day & Feedback' },
    ],
  },

  // ─── PAST ──────────────────────────────────────────────────────────────────
  {
    id: 'evt-005',
    title: 'Advanced React Patterns Workshop',
    description:
      'Deep dive into hooks, compound components, render props, and React 19 concurrent features.',
    fullDescription:
      'In this 4-hour in-depth workshop, our senior developers walked through advanced React patterns used in production codebases: compound components, custom hook composition, render props, React 19 concurrent features (Suspense boundaries, transitions), and state management architecture. Recording available for all Code Vimarsh members.',
    date: '2026-01-18',
    displayDate: 'January 18, 2026',
    time: '10:00 AM – 2:00 PM IST',
    location: 'MSU Baroda • IT Lab 3',
    venue: 'IT Lab 3, Dept. of Computer Science, MSU Baroda',
    status: 'past',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['React', 'TypeScript', 'Frontend', 'Workshop'],
    speakers: [
      { id: 's9', name: 'Mihir Trivedi', title: 'React Core Contributor' },
      { id: 's10', name: 'Pooja Joshi', title: 'Frontend Lead, Code Vimarsh' },
    ],
    schedule: [
      { time: '10:00 AM', title: 'Compound Components & Context' },
      { time: '11:00 AM', title: 'Custom Hook Composition Patterns' },
      { time: '12:00 PM', title: 'React 19 Concurrent Features' },
      { time: '01:00 PM', title: 'Performance Optimisation Lab' },
    ],
  },
  {
    id: 'evt-006',
    title: 'DSA Bootcamp – Trees & Graphs',
    description:
      'Intensive 2-day drill on tree traversals, graph algorithms, and competitive problem-solving strategies.',
    fullDescription:
      'A capacity-capped, intensive bootcamp where participants solved 25+ curated problems on Trees and Graphs. Topics covered: BFS/DFS, shortest path algorithms (Dijkstra, Bellman-Ford), minimum spanning trees, topological sort, and graph DP. Problems sourced from LeetCode, Codeforces, and past placement drives.',
    date: '2025-12-07',
    displayDate: 'December 7–8, 2025',
    time: '9:00 AM – 5:00 PM (both days)',
    location: 'MSU Baroda • Computer Lab',
    venue: 'Computer Lab, Dept. of Computer Science, MSU Baroda',
    status: 'past',
    image:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['DSA', 'Competitive Programming', 'Algorithms', 'Bootcamp'],
    speakers: [
      { id: 's11', name: 'Neel Parikh', title: 'ICPC Regionals Qualifier' },
    ],
    schedule: [
      { time: 'Day 1 AM', title: 'Tree Traversals & Applications' },
      { time: 'Day 1 PM', title: 'Graph Representation & BFS/DFS' },
      { time: 'Day 2 AM', title: 'Shortest Path & MST Algorithms' },
      { time: 'Day 2 PM', title: 'Mock Contest' },
    ],
  },
  {
    id: 'evt-007',
    title: 'DevOps Day: CI/CD from Zero to Hero',
    description:
      'A hands-on day mastering GitHub Actions, Docker, and Kubernetes for real-world deployment pipelines.',
    fullDescription:
      'Participants set up a full CI/CD pipeline from scratch during this hands-on event. Starting from a bare Node.js app, attendees containerised with Docker, pushed to GitHub Container Registry, automated tests via GitHub Actions, and deployed to a Kubernetes cluster on GCP. Each attendee left with a working pipeline template on their GitHub.',
    date: '2025-10-25',
    displayDate: 'October 25, 2025',
    time: '10:00 AM – 5:00 PM IST',
    location: 'MSU Baroda • IT Block',
    venue: 'IT Block Lab 2, Faculty of Technology, MSU Baroda',
    status: 'past',
    image:
      'https://images.unsplash.com/photo-1667372393913-5b0e1f845e5a?w=800&q=80',
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'Hands-On'],
    speakers: [
      { id: 's12', name: 'Samarth Kulkarni', title: 'Platform Engineer, Razorpay' },
    ],
    schedule: [
      { time: '10:00 AM', title: 'Docker Deep Dive' },
      { time: '12:00 PM', title: 'GitHub Actions & CI Automation' },
      { time: '01:00 PM', title: 'Lunch' },
      { time: '02:00 PM', title: 'Kubernetes Deployments' },
      { time: '04:00 PM', title: 'Full Pipeline Lab' },
    ],
  },
];
