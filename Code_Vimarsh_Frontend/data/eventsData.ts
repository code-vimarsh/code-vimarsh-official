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
  // ─── UPCOMING / LIVE ──────────────────────────────────────────────────────────────
  {
    id: 'evt-1',
    title: 'Placement prep by Subham Shah',
    description: 'Comprehensive placement preparation strategy and insights by Subham Shah.',
    fullDescription: 'Join Subham Shah for an offline, in-depth placement preparation session. Get insights into coding rounds, technical interviews, and resume building.',
    date: '2026-01-07',
    displayDate: 'January 7, 2026',
    time: 'TBD',
    location: 'Offline',
    venue: 'MSU Baroda',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    tags: ['Placement', 'Career', 'Offline'],
    capacity: 100,
    registeredCount: 85,
    speakers: [{ id: 's1', name: 'Subham Shah', title: 'Alumni / Expert' }],
    schedule: [],
  },
  {
    id: 'evt-2',
    title: 'Alumni x 1st Year Meetup',
    description: 'An interactive meetup between MSU alumni and 1st year students.',
    fullDescription: 'A virtual interactive session connecting our 1st year students with accomplished Code Vimarsh alumni. Ask questions, get guidance, and build your network early.',
    date: '2026-01-20',
    displayDate: 'January 20, 2026',
    time: 'TBD',
    location: 'Online',
    venue: 'Zoom/Discord',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80',
    tags: ['Meetup', 'Alumni', 'Networking'],
    capacity: 150,
    registeredCount: 120,
    speakers: [
      { id: 's2', name: 'Sandip Parmar', title: 'Alumni' },
      { id: 's3', name: 'Krupal Patel', title: 'Alumni' },
      { id: 's4', name: 'Het Patel', title: 'Alumni' }
    ],
    schedule: [],
  },
  {
    id: 'evt-3',
    title: 'DSA Contest Round 1',
    description: 'Offline Data Structures and Algorithms contest for 1st, 2nd, and 3rd year students.',
    fullDescription: 'Compete in the first round of our flagship DSA contest series. Test your problem solving skills in a competitive offline environment.',
    date: '2026-01-23',
    displayDate: 'January 23, 2026',
    time: 'TBD',
    location: 'Offline',
    venue: 'MSU Baroda Labs',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['DSA', 'Contest', 'Offline'],
    capacity: 200,
    registeredCount: 180,
    speakers: [
      { id: 's5', name: 'Kavya Patel', title: 'Lead' },
      { id: 's6', name: 'Dhriti Gandhi', title: 'Lead' }
    ],
    schedule: [],
  },
  {
    id: 'evt-4',
    title: 'FireSide Chat - 4',
    description: 'An open interactive discussion bridging the gap between learning and industry.',
    fullDescription: 'Join our hybrid FireSide Chat featuring Sandip Parmar and Het Patel. Open for all students to discuss tech trends, college life, and career progression.',
    date: '2026-02-07',
    displayDate: 'February 7, 2026',
    time: 'TBD',
    location: 'Online + Offline',
    venue: 'MSU Baroda & Discord',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    tags: ['Discussion', 'Hybrid', 'Open For All'],
    capacity: 200,
    registeredCount: 150,
    speakers: [
      { id: 's7', name: 'Sandip Parmar', title: 'Speaker' },
      { id: 's8', name: 'Het Patel', title: 'Speaker' },
      { id: 's9', name: 'Dhriti Gandhi', title: 'Coordinator' },
      { id: 's10', name: 'Ansh Mistry', title: 'Coordinator' }
    ],
    schedule: [],
  },
  {
    id: 'evt-5',
    title: 'Post Contest discussion for Leetcode weekly contest',
    description: 'Live discussion of the weekly LeetCode contest problems and solutions.',
    fullDescription: 'Stuck on a LeetCode problem from the weekly contest? Join us online as we break down the solutions, optimal approaches, and alternative methods for each question.',
    date: '2026-02-08',
    displayDate: 'February 8, 2026',
    time: 'TBD',
    location: 'Online',
    venue: 'Discord Voice Channel',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
    tags: ['LeetCode', 'DSA', 'Discussion'],
    capacity: 500,
    registeredCount: 300,
    speakers: [],
    schedule: [],
  },
  {
    id: 'evt-6',
    title: 'Workshop on Open Source Contribution',
    description: 'Learn the fundamentals of Git, GitHub, and contributing to open-source projects.',
    fullDescription: 'A beginner friendly offline workshop covering everything you need to know about Open Source. From your first commit to making meaningful contributions to massive repositories.',
    date: '2026-02-12',
    displayDate: 'February 12, 2026',
    time: 'TBD',
    location: 'Offline',
    venue: 'MSU Baroda',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    tags: ['Open Source', 'GitHub', 'Workshop'],
    capacity: 100,
    registeredCount: 45,
    speakers: [],
    schedule: [],
  }
];
