import { NavItem, EventType, ProjectType, AchievementType, TeamMember, BlogPost, ManagedBlog, ManagedAchievement, VideoResource, LinkResource } from './types';

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
  {
    id: '1',
    title: 'Nexus OS',
    description: 'A microkernel-based OS focused on real-time processing and extreme security.',
    shortDescription: 'A microkernel-based operating system focused on real-time processing and extreme security, built from scratch.',
    fullDescription: 'Nexus OS is a research-grade microkernel operating system built to explore the limits of system security and real-time performance. Designed with a minimal kernel surface to reduce attack vectors, it implements message-passing IPC and user-space drivers for maximum isolation.',
    features: [
      'Microkernel architecture with user-space drivers',
      'Hard real-time scheduling with bounded latency guarantees',
      'Capability-based access control model',
      'Custom bootloader and memory management unit',
      'Ported POSIX subset for app compatibility',
    ],
    category: 'Systems',
    tech: ['Rust', 'C', 'Assembly', 'QEMU'],
    author: 'Code Vimarsh Core',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    isPublished: true,
    links: { github: 'https://github.com' },
  },
  {
    id: '2',
    title: 'Vimarsh Connect',
    description: 'A decentralized social platform for student developers to collaborate and share snippets.',
    shortDescription: 'Decentralized social platform for student developers to collaborate, share code snippets, and build in public.',
    fullDescription: 'Vimarsh Connect bridges the gap between student developers by providing a collaborative space to share knowledge, post code snippets, and find project teammates. It uses a decentralized data model powered by PostgreSQL with plans for IPFS storage.',
    features: [
      'Real-time collaborative code editor',
      'Project showcase with nested comments',
      'Follow system and developer profiles',
      'Tag-based snippet discovery',
      'Webhook notifications via Discord & Slack',
    ],
    category: 'Web',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    author: 'Web Dev Team',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    isPublished: true,
    links: { github: 'https://github.com' },
  },
  {
    id: '3',
    title: 'Visionary AR',
    description: 'An AR assistant that identifies electronic components and displays datasheets in real-time.',
    shortDescription: 'Augmented reality assistant that identifies electronic components via camera and overlays live datasheet information.',
    fullDescription: 'Visionary AR uses computer vision and a custom-trained neural network to recognize electronic components through a smartphone camera and overlay relevant datasheet data, pinout diagrams, and supplier links in real-time AR.',
    features: [
      'Custom CNN trained on 50k+ component images',
      'Real-time AR overlay with ARKit & ARCore',
      'Offline-capable component database',
      'Voice-guided component identification',
      'Export annotated images for documentation',
    ],
    category: 'AI / ML',
    tech: ['Python', 'PyTorch', 'OpenCV', 'Unity'],
    author: 'AI Research Group',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    isPublished: true,
    links: { github: 'https://github.com' },
  },
  {
    id: '4',
    title: 'SwiftPay Mobile',
    description: 'Ultra-fast, secure mobile wallet with offline transactions via Bluetooth Low Energy.',
    shortDescription: 'Ultra-fast secure mobile wallet enabling offline peer-to-peer transactions using Bluetooth Low Energy protocol.',
    fullDescription: 'SwiftPay solves the "no internet" payment problem by enabling fully signed, cryptographically secure transactions over BLE. When internet is restored, transactions are settled on-chain. It uses a zero-knowledge proof scheme for privacy-preserving offline payments.',
    features: [
      'Offline BLE transaction protocol with replay protection',
      'Zero-knowledge proof based privacy model',
      'Sub-second settlement over LTE/WiFi',
      'Biometric & PIN dual-factor authentication',
      'Multi-currency support with live conversion',
    ],
    category: 'Mobile',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLE'],
    author: 'Mobile Squad',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    isPublished: true,
    links: { github: 'https://github.com' },
  },
  {
    id: '5',
    title: 'Aether Engine',
    description: 'High-performance 2D game engine written in C++ with a custom rendering pipeline.',
    shortDescription: 'High-performance open-source 2D game engine written in C++ featuring a custom OpenGL rendering pipeline.',
    fullDescription: 'Aether Engine is a fully open-source 2D game engine targeting indie developers who need low-level control without engine bloat. It ships with a scene graph, entity-component system, physics integration, and a Lua scripting layer for rapid game logic.',
    features: [
      'Custom OpenGL batched sprite renderer (100k+ sprites @ 60fps)',
      'Entity-Component-System architecture',
      'Integrated Box2D physics with custom debug draw',
      'Hot-reload Lua scripting layer',
      'Cross-platform: Windows, Linux, macOS',
    ],
    category: 'Open Source',
    tech: ['C++', 'OpenGL', 'SDL2', 'Lua'],
    author: 'Game Dev Collective',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    isPublished: true,
    links: { github: 'https://github.com' },
  },
  {
    id: '6',
    title: 'Neural Scribe',
    description: 'AI-powered documentation generator that converts codebase logic into human-readable wiki pages.',
    shortDescription: 'AI-powered tool that automatically generates clear, structured documentation from any codebase using LLMs.',
    fullDescription: 'Neural Scribe parses a repository, builds an AST-level call graph, and feeds structured summaries into an LLM to generate wiki-style documentation complete with function references, architectural overviews, and onboarding guides — maintained automatically on every commit.',
    features: [
      'AST-level code understanding across 12 languages',
      'Auto-generated architecture diagrams via Mermaid',
      'CI/CD integration — docs update on every PR',
      'Multi-LLM backend (OpenAI, Anthropic, local Ollama)',
      'Markdown + Notion + Confluence export targets',
    ],
    category: 'AI / ML',
    tech: ['TypeScript', 'LLMs', 'Node.js', 'Vector DBs'],
    author: 'NLP Team',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    isPublished: true,
    links: { github: 'https://github.com' },
  },
];

export const MOCK_ACHIEVEMENTS: AchievementType[] = [
  { id: '1', year: '2024', title: 'Smart India Hackathon Winners', description: 'Secured 1st prize in the software edition.', category: 'Hackathon' },
  { id: '2', year: '2023', title: '100+ PRs in Hacktoberfest', description: 'Club milestone reached in a single month.', category: 'Open Source' },
];

export const MOCK_MANAGED_ACHIEVEMENTS: ManagedAchievement[] = [
  { id: 'ma1', title: 'Code Vimarsh Founded', description: 'The journey began with a vision to build a community of passionate coders and problem solvers.', date: 'JAN 2022', tag: 'Founding', icon: '🏛', category: 'Founding', order: 1, createdAt: '2022-01-01T00:00:00Z', updatedAt: '2022-01-01T00:00:00Z' },
  { id: 'ma2', title: 'First Hackathon Organized', description: 'Successfully hosted our inaugural 24-hour hackathon with 150+ participants from across the region.', date: 'APR 2022', tag: 'Hackathon', icon: '⚔️', category: 'Hackathon', order: 2, createdAt: '2022-04-01T00:00:00Z', updatedAt: '2022-04-01T00:00:00Z' },
  { id: 'ma3', title: '500 Members Milestone', description: 'Our community grew to 500 active members, establishing Code Vimarsh as a leading coding community.', date: 'AUG 2022', tag: 'Milestone', icon: '👑', category: 'Milestone', order: 3, createdAt: '2022-08-01T00:00:00Z', updatedAt: '2022-08-01T00:00:00Z' },
  { id: 'ma4', title: 'National Coding Championship', description: 'Represented at the national level with 3 teams qualifying for the finals and 1 team winning gold.', date: 'DEC 2022', tag: 'Hackathon', icon: '🏆', category: 'Hackathon', order: 4, createdAt: '2022-12-01T00:00:00Z', updatedAt: '2022-12-01T00:00:00Z' },
  { id: 'ma5', title: 'Open Source Initiative', description: 'Launched our open-source contribution program, with members contributing to 70+ major projects.', date: 'MAR 2023', tag: 'Open Source', icon: '🔥', category: 'Open Source', order: 5, createdAt: '2023-03-01T00:00:00Z', updatedAt: '2023-03-01T00:00:00Z' },
  { id: 'ma6', title: 'Tech Summit 2023', description: 'Organized a flagship tech summit with industry leaders, attracting 1000+ attendees and 30 speakers.', date: 'JUL 2023', tag: 'Recognition', icon: '🚀', category: 'Recognition', order: 6, createdAt: '2023-07-01T00:00:00Z', updatedAt: '2023-07-01T00:00:00Z' },
  { id: 'ma7', title: '1000 Members Strong', description: 'Crossed the 1000-member mark, becoming one of the largest student-led coding communities.', date: 'NOV 2023', tag: 'Milestone', icon: '👑', category: 'Milestone', order: 7, createdAt: '2023-11-01T00:00:00Z', updatedAt: '2023-11-01T00:00:00Z' },
  { id: 'ma8', title: 'International Recognition', description: 'Featured by global tech platforms for our innovative approach to community-driven coding education.', date: 'FEB 2024', tag: 'Recognition', icon: '🌐', category: 'Recognition', order: 8, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' },
  { id: 'ma9', title: 'Smart India Hackathon Winners', description: 'Secured 1st prize in the software edition, competing against 500+ teams nationwide.', date: 'MAY 2024', tag: 'Hackathon', icon: '🥇', category: 'Hackathon', order: 9, createdAt: '2024-05-01T00:00:00Z', updatedAt: '2024-05-01T00:00:00Z' },
  { id: 'ma10', title: '100+ PRs in Hacktoberfest', description: 'Club milestone reached in a single month — 100+ merged pull requests to major open-source repos.', date: 'SEP 2024', tag: 'Open Source', icon: '⭐', category: 'Open Source', order: 10, createdAt: '2024-09-01T00:00:00Z', updatedAt: '2024-09-01T00:00:00Z' },
];

export const MOCK_TEAM: TeamMember[] = [
  // Team Leads
  { id: 't1', name: 'Mann Shah', section: 'Team Leads', role: 'President', image: '/Mann Shah President.jpg', linkedin: 'https://www.linkedin.com/in/mann-shah-b9b8592ab/', github: 'https://www.github.com/mannshah24', email: 'mann.shah@codevimarsh.org' },
  { id: 't2', name: 'Dhriti Gandhi', section: 'Team Leads', role: 'Vice President', image: '/Dhriti Gandhi Vice President.jpg', linkedin: 'https://www.linkedin.com/in/dhriti-gandhi-0758372b5/', github: 'https://github.com/Dhriti-5', email: 'dhriti.gandhi@codevimarsh.org' },
  { id: 't3', name: 'Kanav Modi', section: 'Team Leads', role: 'Secretary', image: '/Kanav Modi Secratory.jpg', linkedin: 'https://www.linkedin.com/in/kanav-modi', github: 'https://github.com/KanavCode', email: 'kanav.modi@codevimarsh.org' },
 { id: 't4', name: 'Kavya Patel', section: 'Team Leads', role: 'Web Team Head', image: '/Kavya Patel Web Team Head.jpg', linkedin: 'https://www.linkedin.com/in/kavya-patel-msu/', github: 'https://github.com/K9Patel', email: 'kavya.patel@codevimarsh.org' },
  { id: 't5', name: 'Het Patel', section: 'Team Leads', role: 'Management Head', image: '/Het Patel Management Head.webp', linkedin: 'https://www.linkedin.com/in/hetppatel16', github: 'https://github.com/hetppatel16', email: 'het.patel@codevimarsh.org' },
  { id: 't6', name: 'Daxa Dubey', section: 'Team Leads', role: 'Event Head', image: '/Daxa Dubey Event Head.jpg', linkedin: 'https://ln.run/S5zUj', github: 'https://github.com/Daxadubey', email: 'daxa.dubey@codevimarsh.org' },
  { id: 't7', name: 'Kirtan Patel', section: 'Team Leads', role: 'Design Head', image: '/Kirtan Patel Design Head.jpg', linkedin: 'https://www.linkedin.com/in/kirtan-patel-988218301', github: 'https://github.com/KirtanKRP', email: 'kirtan.patel@codevimarsh.org' },
  // Web Team
  { id: 'w1', name: 'Neel Prajapati', section: 'Web Team', role: 'Frontend Team Lead', image: '/Neel Prajapati Web Team Member.png', linkedin: 'https://www.linkedin.com/in/neel-prajapati-447531330', github: 'https://github.com/Neel-2606', email: 'neel.prajapati@codevimarsh.org' },
  { id: 'w2', name: 'Aryan Buha', section: 'Web Team', role: 'Web Team Member', image: '/Aryan Buha Frontend Team Member.jpg', linkedin: 'https://www.linkedin.com/in/aryan-buha-874a5434b', github: 'https://github.com/Aryanbuha89', email: 'aryan.buha@codevimarsh.org' },
  { id: 'w3', name: 'Krushit Prajapati', section: 'Web Team', role: 'Web Team Member', image: '/Krushit Prajapati Web Team Member.jpg', linkedin: 'https://www.linkedin.com/in/krushit-prajapati-2b11a832b', github: 'https://github.com/krushit1307', email: 'krushit.prajapati@codevimarsh.org' },
  { id: 'w4', name: 'Dhruv Pathak', section: 'Web Team', role: 'Web Team Member', image: '/Dhruv Pathak Web Team Member.jpg', linkedin: 'https://www.linkedin.com/in/dhruv-pathak-a3041a317', github: 'https://github.com/DhruvPathak767', email: 'dhruv.pathak@codevimarsh.org' },
  { id: 'w5', name: 'Ashish Gokani', section: 'Web Team', role: 'Web Team Member', image: '/Ashish Gokani Web Team Member.png', linkedin: 'https://www.linkedin.com/in/ashishgokani', github: 'https://github.com/ashishgokani', email: 'ashish.gokani@codevimarsh.org' },
  { id: 'w6', name: 'Deep Jaiswal', section: 'Web Team', role: 'Web Team Member', image: '/Deep Jaiswal Web Team Member.jpeg', linkedin: 'https://www.linkedin.com/in/deep-jaiswal-4145a23a1', github: 'https://github.com/Deep2812msu2006', email: 'deep.jaiswal@codevimarsh.org' },
  { id: 'w7', name: 'Shivam Suthar', section: 'Web Team', role: 'Web Team Member', image: '/Shivam Suthar Web Team Member.jpg', linkedin: 'https://www.linkedin.com/in/shivam-suthar-3b3024392', github: 'https://github.com/shiv-05-07', email: 'shivam.suthar@codevimarsh.org' },
  { id: 'w8', name: 'Dhruvil Dattani', section: 'Web Team', role: 'Web Team Member', image: '/Dhruvil Dattani Web Team Member.png', linkedin: 'https://www.linkedin.com/in/dhruvil-dattani-b43599317/', github: 'https://github.com/DhruvilTech/', email: 'dhruvil.dattani@codevimarsh.org' },
  // Management
  { id: 'm1', name: 'Kesha Babriya', section: 'Management', role: 'Management Team Member', image: '/Kesha Babriya Management Team Member.jpg', linkedin: 'https://www.linkedin.com/in/kesha-babriya-09151a350', github: 'https://github.com/Kesha-Babriya', email: 'kesha.babriya@codevimarsh.org' },
    { id: 'm2', name: 'Madhvi Mungra', section: 'Management', role: 'Management Team Member', image: '/Madhvi Mungra Management Team Member.jpg', linkedin: 'https://www.linkedin.com/in/mungara-madhvi-466526338', github: 'https://github.com/Madhavi-1202', email: 'kesha.babriya@codevimarsh.org' },
  { id: 'm3', name: 'Ansh Mistry', section: 'Management', role: 'Management Team Member', image: '/Ansh Mistry Management Member.jpg', linkedin: 'https://www.linkedin.com/in/ansh-mistry-ab7805340/', github: 'https://github.com/Ansh-Mistry', email: 'ansh.mistry@codevimarsh.org' },
  { id: 'm4', name: 'Krish Barvaliya', section: 'Management', role: 'Management Team Member', image: '/Krish Baravaliya Management Team Member.jpeg', linkedin: 'https://www.linkedin.com/in/krish-barvaliya-74a493278', github: 'https://github.com/barvaliyakrish013', email: 'krish.barvaliya@codevimarsh.org' },
  { id: 'm5', name: 'Vaishnavi Patel', section: 'Management', role: 'Management Team Member', image: '/Vaishnavi Patel Management Meber.jpeg', linkedin: 'https://www.linkedin.com/in/vaishnavi-patel-03431730b', github: 'https://github.com/Vaishnavi3406', email: 'vaishnavi.patel@codevimarsh.org' },
  { id: 'm6', name: 'Priyal Dalal', section: 'Management', role: 'Management Team Member', image: '/Priyal Dalal Management Team.jpg', linkedin: 'https://www.linkedin.com/in/priyal-dalal-911746363', github: 'https://github.com/Priyal028', email: 'priyal.dalal@codevimarsh.org' },
  { id: 'm7', name: 'Harshita Goyal', section: 'Management', role: 'Management Team Member', image: '/Harshita Goyal Management Team Member .jpg', linkedin: 'https://www.linkedin.com/in/harshita-goyal-8b69903b2', github: 'https://github.com/harshitagoyal27', email: 'harshita.goyal@codevimarsh.org' },
  // Design Team
  { id: 'd1', name: 'Manthan Khedekar', section: 'Design Team', role: 'Design Team Member', image: '/Manthan Khedkar Design Team Member.webp', linkedin: 'https://www.linkedin.com/in/manthan-khedekar-9286b0238', github: 'https://github.com/Manthan2806', email: 'manthan.khedekar@codevimarsh.org' },
  { id: 'd2', name: 'Sneh Bhikadiya', section: 'Design Team', role: 'Design Team Member', image: '/Sneh Bhikhadiya Design Team Member.png', linkedin: 'https://www.linkedin.com/in/sneh-bhikadiya-97b9a9377', github: 'https://github.com/snehbhikadiya87-pixel', email: 'sneh.bhikadiya@codevimarsh.org' },
  { id: 'd3', name: 'Darshan Vasava', section: 'Design Team', role: 'Design Team Member', image: '/Darshan Vasava Design Team Member.jpg', linkedin: 'https://www.linkedin.com/in/vasava-darshankumar-53a27a379', github: 'https://github.com/swt-drx08', email: 'darshan.vasava@codevimarsh.org' },
  { id: 'd4', name: 'Srushti Dadhania', section: 'Design Team', role: 'Design Team Member', image: '/Srushti Dadhania Design Team Member.jpg', linkedin: 'https://www.linkedin.com/in/srushti-dadhania-741262240', github: 'https://github.com/srushti28-web', email: 'srushti.dadhania@codevimarsh.org' },
  { id: 'd5', name: 'Shiv Patel', section: 'Design Team', role: 'Design Team Member', image: '/Shiv Patel Design Team Member.jpeg', linkedin: 'https://www.linkedin.com/in/shiv-patel-86665930a', github: 'https://github.com/Shiv230604', email: 'darshan.vasava@codevimarsh.org' },
];

export const MOCK_BLOGS: BlogPost[] = [
  { id: '1', title: 'Building Scalable Systems with Go', excerpt: 'Learn how we migrated our backend services to handle 10x traffic.', date: 'Oct 12, 2024', author: 'Aarav Patel', tags: ['Backend', 'Go'] },
  { id: '2', title: 'Demystifying WebGL and Three.js', excerpt: 'A beginner-friendly guide to rendering 3D graphics on the web.', date: 'Sep 28, 2024', author: 'Neha Gupta', tags: ['Frontend', '3D'] },
];

export const MOCK_MANAGED_BLOGS: ManagedBlog[] = [
  {
    id: 'mb1',
    title: 'Mastering Dynamic Programming',
    slug: 'mastering-dynamic-programming',
    topic: 'DSA',
    shortDescription: 'Three mental models that crack every DP problem — Memoize, Tabulate, Optimize.',
    content: `# Mastering Dynamic Programming\n\nDynamic programming boils down to one insight: cache overlapping sub-problem answers.\n\n## Top-Down Memoization\n\n\`\`\`python\ndef fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 2:   return 1\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n\`\`\`\n\n## When to use DP?\n\nIf the problem asks for an optimal value (min/max/count) AND sub-answers are reused — DP is your tool.`,
    featuredImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    images: [],
    authorName: 'Aryan Shah',
    authorRole: 'Core Member',
    tags: ['DSA', 'Algorithms', 'Python'],
    status: 'Published',
    createdAt: '2025-02-18T10:00:00Z',
    updatedAt: '2025-02-18T10:00:00Z',
  },
  {
    id: 'mb2',
    title: 'Production REST API with Node.js',
    slug: 'production-rest-api-nodejs',
    topic: 'Web Development',
    shortDescription: 'JWT auth, rate-limiting, and Postgres pooling — battle-tested at 10k+ req/sec.',
    content: `# Production REST API with Node.js\n\nProduction APIs need auth, error handling, and observability from day one.\n\n## JWT Middleware\n\n\`\`\`javascript\nconst auth = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(403).json({ error: 'Invalid token' });\n  }\n};\n\`\`\``,
    featuredImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    images: [],
    authorName: 'Neel Patel',
    authorRole: 'Lead',
    tags: ['Backend', 'Node.js', 'REST API'],
    status: 'Published',
    createdAt: '2025-01-30T08:00:00Z',
    updatedAt: '2025-01-30T08:00:00Z',
  },
  {
    id: 'mb3',
    title: 'How LLMs Actually Work',
    slug: 'how-llms-actually-work',
    topic: 'AI / ML',
    shortDescription: 'Transformers, self-attention, RLHF — from first principles, no PhD required.',
    content: `# How LLMs Actually Work\n\nLLMs are probability machines that predict the next token given prior context.\n\n## Scaled Dot-Product Attention\n\n\`\`\`python\ndef attention(Q, K, V):\n    d_k = Q.shape[-1]\n    scores = Q @ K.T / d_k**0.5\n    weights = softmax(scores, dim=-1)\n    return weights @ V\n\`\`\`\n\n## RLHF in plain English\n\nReinforcement Learning from Human Feedback fine-tunes model outputs using ranked human preferences.`,
    featuredImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    images: [],
    authorName: 'Priya Mehta',
    authorRole: 'Guest',
    tags: ['AI', 'ML', 'LLM', 'Transformers'],
    status: 'Published',
    createdAt: '2025-02-05T09:00:00Z',
    updatedAt: '2025-02-05T09:00:00Z',
  },
  {
    id: 'mb4',
    title: 'Nexus Hackathon 2025 — Behind the Scenes',
    slug: 'nexus-hackathon-2025-behind-the-scenes',
    topic: 'Hackathon',
    shortDescription: 'What went into organising Code Vimarsh\'s flagship 24-hour hackathon. The logistics, the chaos, the wins.',
    content: `# Nexus Hackathon 2025\n\nOrganising a 24-hour hackathon for 200+ students is no small feat. Here's how we did it.\n\n## Planning Timeline\n\nWe started 8 weeks out with venue booking, sponsor outreach, and problem statement design.\n\n## Key Takeaways\n\n- Start mentor recruiting early\n- Automate registration with proper forms\n- Keep the judging rubric transparent`,
    featuredImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    images: [],
    authorName: 'Admin',
    authorRole: 'Admin',
    tags: ['Hackathon', 'Event', 'Community'],
    status: 'Draft',
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2025-03-01T12:00:00Z',
  },
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