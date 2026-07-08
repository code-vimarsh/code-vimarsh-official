-- Code Vimarsh Supabase Seed Data Script
-- Paste this script into the Supabase SQL Editor to populate all mock data for testing.

-- Clean up existing data to avoid unique constraint violations
truncate public.event_registrations cascade;
truncate public.events cascade;
truncate public.projects cascade;
truncate public.team_members cascade;
truncate public.alumni cascade;
truncate public.blogs cascade;
truncate public.achievements cascade;
truncate public.resources cascade;

-- 1. Create a Seed Super Admin Profile (foreign key dependency for events/blogs)
insert into public.profiles (id, prn, full_name, email, role, xp, level, is_verified)
values (
  'd3023ebc-6415-4632-a583-6cc3b145a121',
  '220000000000',
  'Deep Jaiswal',
  'deep@vimarsh.dev',
  'SUPER_ADMIN',
  1500,
  5,
  true
) on conflict (prn) do nothing;

-- 2. Populate Events (using valid UUID formats)
insert into public.events (id, title, slug, description, long_description, event_type, status, location, start_date, end_date, banner_image_url, topics, max_participants, form_fields, is_published, created_by)
values
(
  'e0011111-1111-1111-1111-111111111111',
  'Placement prep by Subham Shah',
  'placement-prep-subham-shah',
  'Comprehensive placement preparation strategy and insights by Subham Shah.',
  'Join Subham Shah for an offline, in-depth placement preparation session. Get insights into coding rounds, technical interviews, and resume building.',
  'Workshop',
  'Past',
  'Offline - MSU Baroda',
  '2026-01-07 10:00:00+00',
  '2026-01-07 13:00:00+00',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
  array['Placement', 'Career', 'Offline'],
  100,
  '[]'::jsonb,
  true,
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'e0022222-2222-2222-2222-222222222222',
  'Alumni x 1st Year Meetup',
  'alumni-x-1st-year-meetup',
  'An interactive meetup between MSU alumni and 1st year students.',
  'A virtual interactive session connecting our 1st year students with accomplished Code Vimarsh alumni. Ask questions, get guidance, and build your network early.',
  'Webinar',
  'Past',
  'Online - Zoom/Discord',
  '2026-01-20 11:00:00+00',
  '2026-01-20 14:00:00+00',
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80',
  array['Meetup', 'Alumni', 'Networking'],
  150,
  '[]'::jsonb,
  true,
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'e0033333-3333-3333-3333-333333333333',
  'DSA Contest Round 1',
  'dsa-contest-round-1',
  'Offline Data Structures and Algorithms contest for 1st, 2nd, and 3rd year students.',
  'Compete in the first round of our flagship DSA contest series. Test your problem solving skills in a competitive offline environment.',
  'Hackathon',
  'Past',
  'Offline - MSU Baroda Labs',
  '2026-01-23 09:00:00+00',
  '2026-01-23 12:00:00+00',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  array['DSA', 'Contest', 'Offline'],
  200,
  '[]'::jsonb,
  true,
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'e0044444-4444-4444-4444-444444444444',
  'FireSide Chat - 4',
  'fireside-chat-4',
  'An open interactive discussion bridging the gap between learning and industry.',
  'Join our hybrid FireSide Chat featuring Sandip Parmar and Het Patel. Open for all students to discuss tech trends, college life, and career progression.',
  'Webinar',
  'Past',
  'Online + Offline - MSU Baroda & Discord',
  '2026-02-07 14:00:00+00',
  '2026-02-07 17:00:00+00',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  array['Discussion', 'Hybrid', 'Open For All'],
  200,
  '[]'::jsonb,
  true,
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'e0055555-5555-5555-5555-555555555555',
  'Post Contest discussion for Leetcode weekly contest',
  'leetcode-contest-discussion',
  'Live discussion of the weekly LeetCode contest problems and solutions.',
  'Stuck on a LeetCode problem from the weekly contest? Join us online as we break down the solutions, optimal approaches, and alternative methods for each question.',
  'Workshop',
  'Past',
  'Online - Discord Voice Channel',
  '2026-02-08 15:00:00+00',
  '2026-02-08 17:00:00+00',
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
  array['LeetCode', 'DSA', 'Discussion'],
  500,
  '[]'::jsonb,
  true,
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'e0066666-6666-6666-6666-666666666666',
  'Workshop on Open Source Contribution',
  'workshop-open-source-contribution',
  'Learn the fundamentals of Git, GitHub, and contributing to open-source projects.',
  'A beginner friendly offline workshop covering everything you need to know about Open Source. From your first commit to making meaningful contributions to massive repositories.',
  'Workshop',
  'Live',
  'Offline - MSU Baroda',
  '2026-02-12 11:00:00+00',
  '2026-02-12 14:00:00+00',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
  array['Open Source', 'GitHub', 'Workshop'],
  100,
  '[
    {"id": "field_name", "type": "short_text", "label": "Full Name", "required": true},
    {"id": "field_email", "type": "email", "label": "Email Address", "required": true},
    {"id": "field_whatsapp", "type": "phone", "label": "WhatsApp Number", "required": true},
    {"id": "field_branch", "type": "dropdown", "label": "Branch", "required": true, "options": [
      {"id": "opt_cse", "value": "Computer Science & Engineering"},
      {"id": "opt_it", "value": "Information Technology"},
      {"id": "opt_ee", "value": "Electrical Engineering"},
      {"id": "opt_other", "value": "Other"}
    ]}
  ]'::jsonb,
  true,
  'd3023ebc-6415-4632-a583-6cc3b145a121'
)
on conflict (id) do nothing;

-- 3. Populate Event Registrations (Optional seeds)
insert into public.event_registrations (id, event_id, full_name, email, phone, status, custom_answers)
values
(
  'f0011111-1111-1111-1111-111111111111',
  'e0066666-6666-6666-6666-666666666666',
  'Dev Mehta',
  'dev@example.com',
  '9876543210',
  'attended',
  '{"field_name": "Dev Mehta", "field_email": "dev@example.com", "field_whatsapp": "9876543210", "field_branch": "Computer Science & Engineering"}'::jsonb
),
(
  'f0022222-2222-2222-2222-222222222222',
  'e0066666-6666-6666-6666-666666666666',
  'Riya Patel',
  'riya@example.com',
  '9988776655',
  'registered',
  '{"field_name": "Riya Patel", "field_email": "riya@example.com", "field_whatsapp": "9988776655", "field_branch": "Information Technology"}'::jsonb
)
on conflict (id) do nothing;

-- 4. Populate Projects
insert into public.projects (id, title, short_description, full_description, features, category, tech_stack, github_link, live_link, image_url, is_published)
values
(
  'b0011111-1111-1111-1111-111111111111',
  'Nexus OS',
  'A microkernel-based OS focused on real-time processing and extreme security.',
  'Nexus OS is a research-grade microkernel operating system built to explore the limits of system security and real-time performance. Designed with a minimal kernel surface to reduce attack vectors, it implements message-passing IPC and user-space drivers for maximum isolation.',
  array['Microkernel architecture with user-space drivers', 'Hard real-time scheduling with bounded latency guarantees', 'Capability-based access control model', 'Custom bootloader and memory management unit', 'Ported POSIX subset for app compatibility'],
  'Systems',
  array['Rust', 'C', 'Assembly', 'QEMU'],
  'https://github.com',
  'https://google.com',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  true
),
(
  'b0022222-2222-2222-2222-222222222222',
  'Vimarsh Connect',
  'A decentralized social platform for student developers to collaborate and share snippets.',
  'Vimarsh Connect bridges the gap between student developers by providing a collaborative space to share knowledge, post code snippets, and find project teammates. It uses a decentralized data model powered by PostgreSQL with plans for IPFS storage.',
  array['Real-time collaborative code editor', 'Project showcase with nested comments', 'Follow system and developer profiles', 'Tag-based snippet discovery', 'Webhook notifications via Discord & Slack'],
  'Web',
  array['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
  'https://github.com',
  'https://google.com',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  true
),
(
  'b0033333-3333-3333-3333-333333333333',
  'Visionary AR',
  'An AR assistant that identifies electronic components and displays datasheets in real-time.',
  'Visionary AR uses computer vision and a custom-trained neural network to recognize electronic components through a smartphone camera and overlay relevant datasheet data, pinout diagrams, and supplier links in real-time AR.',
  array['Custom CNN trained on 50k+ component images', 'Real-time AR overlay with ARKit & ARCore', 'Offline-capable component database', 'Voice-guided component identification', 'Export annotated images for documentation'],
  'Web',
  array['Python', 'PyTorch', 'OpenCV', 'Unity'],
  'https://github.com',
  'https://google.com',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  true
),
(
  'b0044444-4444-4444-4444-444444444444',
  'SwiftPay Mobile',
  'Ultra-fast, secure mobile wallet with offline transactions via Bluetooth Low Energy.',
  'SwiftPay solves the "no internet" payment problem by enabling fully signed, cryptographically secure transactions over BLE. When internet is restored, transactions are settled on-chain. It uses a zero-knowledge proof scheme for privacy-preserving offline payments.',
  array['Offline BLE transaction protocol with replay protection', 'Zero-knowledge proof based privacy model', 'Sub-second settlement over LTE/WiFi', 'Biometric & PIN dual-factor authentication', 'Multi-currency support with live conversion'],
  'Web',
  array['Flutter', 'Dart', 'Firebase', 'BLE'],
  'https://github.com',
  'https://google.com',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  true
),
(
  'b0055555-5555-5555-5555-555555555555',
  'Aether Engine',
  'High-performance 2D game engine written in C++ with a custom rendering pipeline.',
  'Aether Engine is a fully open-source 2D game engine targeting indie developers who need low-level control without engine bloat. It ships with a scene graph, entity-component system, physics integration, and a Lua scripting layer for rapid game logic.',
  array['Custom OpenGL batched sprite renderer (100k+ sprites @ 60fps)', 'Entity-Component-System architecture', 'Integrated Box2D physics with custom debug draw', 'Hot-reload Lua scripting layer', 'Cross-platform: Windows, Linux, macOS'],
  'Systems',
  array['C++', 'OpenGL', 'SDL2', 'Lua'],
  'https://github.com',
  'https://google.com',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
  true
),
(
  'b0066666-6666-6666-6666-666666666666',
  'Neural Scribe',
  'AI-powered documentation generator that converts codebase logic into human-readable wiki pages.',
  'Neural Scribe parses a repository, builds an AST-level call graph, and feeds structured summaries into an LLM to generate wiki-style documentation complete with function references, architectural overviews, and onboarding guides — maintained automatically on every commit.',
  array['AST-level code understanding across 12 languages', 'Auto-generated architecture diagrams via Mermaid', 'CI/CD integration — docs update on every PR', 'Multi-LLM backend (OpenAI, Anthropic, local Ollama)', 'Markdown + Notion + Confluence export targets'],
  'Web',
  array['TypeScript', 'LLMs', 'Node.js', 'Vector DBs'],
  'https://github.com',
  'https://google.com',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
  true
)
on conflict (id) do nothing;

-- 5. Populate Team Members
insert into public.team_members (id, name, email, role, section, bio, github_url, linkedin_url, image_url, sort_order)
values
-- Team Leads
('c0000000-0000-0000-0000-000000000001', 'Mann Shah', 'mann.shah@codevimarsh.org', 'President', 'Team Leads', 'Leading the club to build the ultimate engineering ecosystem at MSU Baroda.', 'https://www.github.com/mannshah24', 'https://www.linkedin.com/in/mann-shah-b9b8592ab/', '/Mann Shah President.jpg', 1),
('c0000000-0000-0000-0000-000000000002', 'Dhriti Gandhi', 'dhriti.gandhi@codevimarsh.org', 'Vice President', 'Team Leads', 'Organizing and managing operations across development groups.', 'https://github.com/Dhriti-5', 'https://www.linkedin.com/in/dhriti-gandhi-0758372b5/', '/Dhriti Gandhi Vice President.jpg', 2),
('c0000000-0000-0000-0000-000000000003', 'Kanav Modi', 'kanav.modi@codevimarsh.org', 'Secretary', 'Team Leads', 'Managing administrative and corporate alignments of the club.', 'https://github.com/KanavCode', 'https://www.linkedin.com/in/kanav-modi', '/Kanav Modi Secratory.jpg', 3),
('c0000000-0000-0000-0000-000000000004', 'Kavya Patel', 'kavya.patel@codevimarsh.org', 'Web Team Head', 'Team Leads', 'Overseeing structural design and engineering for all CV assets.', 'https://github.com/K9Patel', 'https://www.linkedin.com/in/kavya-patel-msu/', '/Kavya Patel Web Team Head.jpg', 4),
('c0000000-0000-0000-0000-000000000005', 'Het Patel', 'het.patel@codevimarsh.org', 'Management Head', 'Team Leads', 'Directing operations, sponsorship pipelines, and university collaborations.', 'https://github.com/hetppatel16', 'https://www.linkedin.com/in/hetppatel16', '/Het Patel Management Head.webp', 5),
('c0000000-0000-0000-0000-000000000006', 'Daxa Dubey', 'daxa.dubey@codevimarsh.org', 'Event Head', 'Team Leads', 'Ideating and scheduling workshops, meetups, and developer hackathons.', 'https://github.com/Daxadubey', 'https://ln.run/S5zUj', '/Daxa Dubey Event Head.jpg', 6),
('c0000000-0000-0000-0000-000000000007', 'Kirtan Patel', 'kirtan.patel@codevimarsh.org', 'Design Head', 'Team Leads', 'Defining aesthetic rules and visual systems for all public platforms.', 'https://github.com/KirtanKRP', 'https://www.linkedin.com/in/kirtan-patel-988218301', '/Kirtan Patel Design Head.jpg', 7),
-- Web Team
('c0000000-0000-0000-0000-000000000011', 'Neel Prajapati', 'neel.prajapati@codevimarsh.org', 'Frontend Team Lead', 'Web Team', 'Structuring React interfaces and micro-interaction controllers.', 'https://github.com/Neel-2606', 'https://www.linkedin.com/in/neel-prajapati-447531330', '/Neel Prajapati Web Team Member.png', 8),
('c0000000-0000-0000-0000-000000000012', 'Aryan Buha', 'aryan.buha@codevimarsh.org', 'Web Team Member', 'Web Team', 'Implementing pixel-perfect responsive panels and visual layouts.', 'https://github.com/Aryanbuha89', 'https://www.linkedin.com/in/aryan-buha-874a5434b', '/Aryan Buha Frontend Team Member.jpg', 9),
('c0000000-0000-0000-0000-000000000013', 'Krushit Prajapati', 'krushit.prajapati@codevimarsh.org', 'Web Team Member', 'Web Team', 'Building web layout adapters and managing resource content grids.', 'https://github.com/krushit1307', 'https://www.linkedin.com/in/krushit-prajapati-2b11a832b', '/Krushit Prajapati Web Team Member.jpg', 10),
('c0000000-0000-0000-0000-000000000014', 'Dhruv Pathak', 'dhruv.pathak@codevimarsh.org', 'Web Team Member', 'Web Team', 'Polishing accessibility profiles and asset preloading pipelines.', 'https://github.com/DhruvPathak767', 'https://www.linkedin.com/in/dhruv-pathak-a3041a317', '/Dhruv Pathak Web Team Member.jpg', 11),
('c0000000-0000-0000-0000-000000000015', 'Ashish Gokani', 'ashish.gokani@codevimarsh.org', 'Web Team Member', 'Web Team', 'Optimizing client routing architectures and state provider trees.', 'https://github.com/ashishgokani', 'https://www.linkedin.com/in/ashishgokani', '/Ashish Gokani Web Team Member.png', 12),
('c0000000-0000-0000-0000-000000000016', 'Deep Jaiswal', 'deep.jaiswal@codevimarsh.org', 'Web Team Member', 'Web Team', 'Fusing Supabase database layers directly to responsive client forms.', 'https://github.com/Deep2812msu2006', 'https://www.linkedin.com/in/deep-jaiswal-4145a23a1', '/Deep Jaiswal Web Team Member.jpeg', 13),
('c0000000-0000-0000-0000-000000000017', 'Shivam Suthar', 'shivam.suthar@codevimarsh.org', 'Web Team Member', 'Web Team', 'Refactoring hooks and rendering triggers for maximum framerates.', 'https://github.com/shiv-05-07', 'https://www.linkedin.com/in/shivam-suthar-3b3024392', '/Shivam Suthar Web Team Member.jpg', 14),
('c0000000-0000-0000-0000-000000000018', 'Dhruvil Dattani', 'dhruvil.dattani@codevimarsh.org', 'Web Team Member', 'Web Team', 'Managing bundler pipelines and asset optimization strategies.', 'https://github.com/DhruvilTech/', 'https://www.linkedin.com/in/dhruvil-dattani-b43599317/', '/Dhruvil Dattani Web Team Member.png', 15),
('c0000000-0000-0000-0000-000000000019', 'Bhavika Giyanani', 'bhavika.giyanani@codevimarsh.org', 'Backend Team Lead', 'Web Team', 'Writing data schema triggers and managing database query pools.', 'https://github.com', 'https://linkedin.com', '/Bhavika Giyanani Web Team Member.jpg', 16),
-- Management
('c0000000-0000-0000-0000-000000000021', 'Kesha Babriya', 'kesha.babriya@codevimarsh.org', 'Management Team Member', 'Management', 'Coordinating event logistics and public communications pipelines.', 'https://github.com/Kesha-Babriya', 'https://www.linkedin.com/in/kesha-babriya-09151a350', '/Kesha Babriya Management Team Member.jpg', 17),
('c0000000-0000-0000-0000-000000000022', 'Madhvi Mungra', 'madhvi.mungra@codevimarsh.org', 'Management Team Member', 'Management', 'Aligning sponsorship relations and student registrations registries.', 'https://github.com/Madhavi-1202', 'https://www.linkedin.com/in/mungara-madhvi-466526338', '/Madhvi Mungra Management Team Member.jpg', 18),
('c0000000-0000-0000-0000-000000000023', 'Ansh Mistry', 'ansh.mistry@codevimarsh.org', 'Management Team Member', 'Management', 'Managing offline venue arrangements and volunteer allocations.', 'https://github.com/Ansh-Mistry', 'https://www.linkedin.com/in/ansh-mistry-ab7805340/', '/Ansh Mistry Management Member.jpg', 19),
('c0000000-0000-0000-0000-000000000024', 'Krish Barvaliya', 'krish.barvaliya@codevimarsh.org', 'Management Team Member', 'Management', 'Handling technical equipment setup and labs coordination.', 'https://github.com/barvaliyakrish013', 'https://www.linkedin.com/in/krish-barvaliya-74a493278', '/Krish Baravaliya Management Team Member.jpeg', 20),
('c0000000-0000-0000-0000-000000000025', 'Vaishnavi Patel', 'vaishnavi.patel@codevimarsh.org', 'Management Team Member', 'Management', 'Overseeing certificate checklists and participant registrations updates.', 'https://github.com/Vaishnavi3406', 'https://www.linkedin.com/in/vaishnavi-patel-03431730b', '/Vaishnavi Patel Management Meber.jpeg', 21),
('c0000000-0000-0000-0000-000000000026', 'Priyal Dalal', 'priyal.dalal@codevimarsh.org', 'Management Team Member', 'Management', 'Managing community channels and announcements timelines.', 'https://github.com/Priyal028', 'https://www.linkedin.com/in/priyal-dalal-911746363', '/Priyal Dalal Management Team.jpg', 22),
('c0000000-0000-0000-0000-000000000027', 'Harshita Goyal', 'harshita.goyal@codevimarsh.org', 'Management Team Member', 'Management', 'Supervising student registration queues and offline scanner checks.', 'https://github.com/harshitagoyal27', 'https://www.linkedin.com/in/harshita-goyal-8b69903b2', '/Harshita Goyal Management Team Member .jpg', 23),
-- Design Team
('c0000000-0000-0000-0000-000000000031', 'Manthan Khedekar', 'manthan.khedekar@codevimarsh.org', 'Design Team Member', 'Design Team', 'Crafting user interface vectors and banner background gradients.', 'https://github.com/Manthan2806', 'https://www.linkedin.com/in/manthan-khedekar-9286b0238', '/Manthan Khedkar Design Team Member.webp', 24),
('c0000000-0000-0000-0000-000000000032', 'Sneh Bhikadiya', 'sneh.bhikadiya@codevimarsh.org', 'Design Team Member', 'Design Team', 'Rendering vector logos and social media template shapes.', 'https://github.com/snehbhikadiya87-pixel', 'https://www.linkedin.com/in/sneh-bhikadiya-97b9a9377', '/Sneh Bhikhadiya Design Team Member.png', 25),
('c0000000-0000-0000-0000-000000000033', 'Darshan Vasava', 'darshan.vasava@codevimarsh.org', 'Design Team Member', 'Design Team', 'Directing photography sessions and editing promotional videos.', 'https://github.com/swt-drx08', 'https://www.linkedin.com/in/vasava-darshankumar-53a27a379', '/Darshan Vasava Design Team Member.jpg', 26),
('c0000000-0000-0000-0000-000000000034', 'Srushti Dadhania', 'srushti.dadhania@codevimarsh.org', 'Design Team Member', 'Design Team', 'Creating typography hierarchies and color palette specifications.', 'https://github.com/srushti28-web', 'https://www.linkedin.com/in/srushti-dadhania-741262240', '/Srushti Dadhania Design Team Member.jpg', 27),
('c0000000-0000-0000-0000-000000000035', 'Shiv Patel', 'shiv.patel@codevimarsh.org', 'Design Team Member', 'Design Team', 'Developing promotional graphics and designing event certificates.', 'https://github.com/Shiv230604', 'https://www.linkedin.com/in/shiv-patel-86665930a', '/Shiv Patel Design Team Member.jpeg', 28)
on conflict (id) do nothing;

-- 6. Populate Alumni
insert into public.alumni (id, name, initials, email, graduation_year, batch, role, company, location, domain, bio, advice, linkedin, github, website, photo, tech, achievements, roadmap, is_featured)
values
(
  'a0011111-1111-1111-1111-111111111111',
  'Sandeep Parmar',
  'SP',
  'sandeep@gmail.com',
  2023,
  '2023',
  'Software Engineer',
  'Google',
  'India',
  'Software Dev',
  'Software Engineer at Google. Passionate about scalable systems and competitive programming.',
  'Focus heavily on Data Structures and Algorithms. Participate in regular contests to build problem-solving speed.',
  'https://linkedin.com/in/sandeep-parmar',
  'https://github.com/sandeepparmar',
  'https://google.com',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80',
  array['C++', 'Python', 'Go', 'Distributed Systems'],
  array['Google SWE', 'Code Vimarsh Event Lead', 'Multiple Hackathon Winner'],
  '[
    {"phase": "01", "title": "DSA Mastery", "items": ["Arrays, Strings, Pointers", "Dynamic Programming", "Graph Theory"]},
    {"phase": "02", "title": "Core Subjects", "items": ["OS Internals", "DBMS (SQL/NoSQL)", "Computer Networks"]}
  ]'::jsonb,
  true
),
(
  'a0022222-2222-2222-2222-222222222222',
  'Jay Prajapati',
  'JP',
  'jay.prajapati@gmail.com',
  2023,
  '2023',
  'Software Engineer',
  'Mastercard',
  'India',
  'Backend / DevOps',
  'Building robust financial systems at Mastercard. Tech enthusiast and open-source contributor.',
  'Understand the business impact of your code. Good engineering is about solving real-world problems.',
  'https://linkedin.com/in/jay-prajapati',
  'https://github.com/jayprajapati',
  'https://google.com',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80',
  array['Java', 'Spring Boot', 'Microservices', 'SQL'],
  array['SDE at Mastercard', 'Strong Backend Developer', 'Active Mentor'],
  '[
    {"phase": "01", "title": "Backend Foundation", "items": ["Java & Spring Boot", "REST API Design", "Database Modeling"]},
    {"phase": "02", "title": "System Design", "items": ["Microservices", "Message Queues", "Caching Strategies"]}
  ]'::jsonb,
  true
),
(
  'a0033333-3333-3333-3333-333333333333',
  'Jay Fanse',
  'JF',
  'jay.fanse@gmail.com',
  2023,
  '2023',
  'Software Engineer',
  'Glomopay',
  'India',
  'Frontend / Web',
  'Developing payment infrastructure at Glomopay. Love exploring modern web technologies.',
  'Stay consistent. It is better to code 1 hour every day than 7 hours on Sunday.',
  'https://linkedin.com/in/jay-fanse',
  'https://github.com/jayfanse',
  'https://google.com',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80',
  array['JavaScript', 'React', 'Node.js', 'Fintech APIs'],
  array['Core Developer at Glomopay', 'Full Stack Expert', 'Hackathon Mentor'],
  '[
    {"phase": "01", "title": "Web Basics", "items": ["HTML/CSS/JS", "Frontend Frameworks", "API Integration"]},
    {"phase": "02", "title": "Advanced Web", "items": ["Authentication", "Payment Gateways", "Web Security"]}
  ]'::jsonb,
  true
),
(
  'a0044444-4444-4444-4444-444444444444',
  'Krupal Patel',
  'KP',
  'krupal.patel@gmail.com',
  2024,
  '2024',
  'Software Engineer',
  'SocialPilot',
  'India',
  'Software Dev',
  'Software Engineer at SocialPilot, crafting seamless user experiences and scalable backend services.',
  'Never hesitate to ask for help, but always try to read the documentation first.',
  'https://linkedin.com/in/krupal-patel',
  'https://github.com/krupalpatel',
  'https://google.com',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80',
  array['React', 'Node.js', 'MongoDB', 'AWS'],
  array['SDE at SocialPilot', 'Code Vimarsh Event Coordinator', 'Full Stack Developer'],
  '[
    {"phase": "01", "title": "MERN Stack", "items": ["React.js", "Node/Express", "MongoDB"]},
    {"phase": "02", "title": "Cloud & Deploy", "items": ["AWS Basics", "Docker", "CI/CD Pipelines"]}
  ]'::jsonb,
  true
),
(
  'a0055555-5555-5555-5555-555555555555',
  'Kuldeep Sinh Jhala',
  'KJ',
  'kuldeep.sinh@gmail.com',
  2024,
  '2024',
  'Software Engineer',
  'Futentia Solutions',
  'India',
  'Software Dev',
  'Driving technological innovation at Futentia Solutions. Passionate about problem-solving and software architecture.',
  'Build projects that you actually want to use. That passion will show in your code and interviews.',
  'https://linkedin.com/in/kuldeep-sinh-jhala',
  'https://github.com/kuldeepsinhjhala',
  'https://google.com',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80',
  array['Python', 'Django', 'React', 'Cloud Infra'],
  array['SDE at Futentia Solutions', 'Tech Innovator', 'Community Mentor'],
  '[
    {"phase": "01", "title": "Full Stack", "items": ["Python & Django", "Frontend frameworks", "API Design"]},
    {"phase": "02", "title": "Architecture", "items": ["Monolith to Microservices", "Cloud Deployment", "Scalability"]}
  ]'::jsonb,
  true
)
on conflict (id) do nothing;

-- 7. Populate Blogs
insert into public.blogs (id, title, slug, topic, short_description, content, featured_image_url, author_name, author_role, tags, status, created_by)
values
(
  'b0011111-1111-1111-1111-111111111111',
  'Mastering Dynamic Programming',
  'mastering-dynamic-programming',
  'DSA',
  'Three mental models that crack every DP problem — Memoize, Tabulate, Optimize.',
  '# Mastering Dynamic Programming\n\nDynamic programming boils down to one insight: cache overlapping sub-problem answers.\n\n## Top-Down Memoization\n\n```python\ndef fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 2:   return 1\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n```',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  'Aryan Shah',
  'Core Member',
  array['DSA', 'Algorithms', 'Python'],
  'Published',
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'b0022222-2222-2222-2222-222222222222',
  'Production REST API with Node.js',
  'production-rest-api-nodejs',
  'Web Development',
  'JWT auth, rate-limiting, and Postgres pooling — battle-tested at 10k+ req/sec.',
  '# Production REST API with Node.js\n\nProduction APIs need auth, error handling, and observability from day one.\n\n## JWT Middleware\n\n```javascript\nconst auth = (req, res, next) => {\n  const token = req.headers.authorization?.split('' '')[1];\n  if (!token) return res.status(401).json({ error: ''Unauthorized'' });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(403).json({ error: ''Invalid token'' });\n  }\n};\n```',
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
  'Neel Patel',
  'Lead',
  array['Backend', 'Node.js', 'REST API'],
  'Published',
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'b0033333-3333-3333-3333-333333333333',
  'How LLMs Actually Work',
  'how-llms-actually-work',
  'AI / ML',
  'Transformers, self-attention, RLHF — from first principles, no PhD required.',
  '# How LLMs Actually Work\n\nLLMs are probability machines that predict the next token given prior context.\n\n## Scaled Dot-Product Attention\n\n```python\ndef attention(Q, K, V):\n    d_k = Q.shape[-1]\n    scores = Q @ K.T / d_k**0.5\n    weights = softmax(scores, dim=-1)\n    return weights @ V\n```',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  'Priya Mehta',
  'Guest',
  array['AI', 'ML', 'LLM', 'Transformers'],
  'Published',
  'd3023ebc-6415-4632-a583-6cc3b145a121'
),
(
  'b0044444-4444-4444-4444-444444444444',
  'Nexus Hackathon 2025 — Behind the Scenes',
  'nexus-hackathon-2025-behind-the-scenes',
  'Hackathon',
  'What went into organising Code Vimarsh''s flagship 24-hour hackathon. The logistics, the chaos, the wins.',
  '# Nexus Hackathon 2025\n\nOrganising a 24-hour hackathon for 200+ students is no small feat. Here''s how we did it.\n\n## Planning Timeline\n\nWe started 8 weeks out with venue booking, sponsor outreach, and problem statement design.',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'Admin',
  'Admin',
  array['Hackathon', 'Event', 'Community'],
  'Draft',
  'd3023ebc-6415-4632-a583-6cc3b145a121'
)
on conflict (id) do nothing;

-- 8. Populate Achievements
insert into public.achievements (id, title, description, date, tag, icon, category, sort_order, year, achievement_type, is_featured)
values
(
  'c0011111-1111-1111-1111-111111111111',
  'IBM Hackathon 2024 - 2nd Position',
  'Secured the 1st Runner Up position at the prestigious IBM Hackathon for building an innovative AI-driven enterprise solution.',
  'MAY 2024',
  'Hackathon',
  '🥈',
  'Hackathon',
  1,
  2024,
  'Hackathon',
  true
),
(
  'c0022222-2222-2222-2222-222222222222',
  'IBM Hackathon 2024 - 3rd Position',
  'Secured the 2nd Runner Up position at the IBM Hackathon, showcasing exceptional problem-solving and cloud architecture skills.',
  'MAY 2024',
  'Hackathon',
  '🥉',
  'Hackathon',
  2,
  2024,
  'Hackathon',
  true
),
(
  'c0033333-3333-3333-3333-333333333333',
  'MSU Hackathon - 3rd Position',
  'Bagged the 3rd position in our home university hackathon with a stellar web application prototype.',
  'FEB 2024',
  'Hackathon',
  '🥉',
  'Hackathon',
  3,
  2024,
  'Hackathon',
  true
),
(
  'c0044444-4444-4444-4444-444444444444',
  'Smart India Hackathon Winners',
  'Secured 1st prize in the software edition, competing against 500+ teams nationwide.',
  'DEC 2023',
  'Hackathon',
  '🥇',
  'Hackathon',
  4,
  2023,
  'Hackathon',
  true
),
(
  'c0055555-5555-5555-5555-555555555555',
  '100+ PRs in Hacktoberfest',
  'Club milestone reached in a single month — 100+ merged pull requests to major open-source repos.',
  'OCT 2023',
  'Open Source',
  '⭐',
  'Open Source',
  5,
  2023,
  'Open Source',
  true
)
on conflict (id) do nothing;

-- 9. Populate Resources
insert into public.resources (id, title, url, category, content_type, description, best_for, thumbnail_url, tags)
values
-- YouTube Videos
(
  '00000000-0000-0000-0000-000000000101',
  'Java Full Course (Beginner to Advanced)',
  'https://youtu.be/eIrMbAQSU34?si=6fk454xxKQu_ta-g',
  'youtube',
  'Playlist',
  'Complete Java learning course.',
  'Beginners to OOP mastery',
  'https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg',
  array['Java', 'Beginner', 'OOP']
),
(
  '00000000-0000-0000-0000-000000000102',
  'C Programming Full Course',
  'https://youtu.be/rQoqCP7LX60?si=ldtuSiE543obcHa3',
  'youtube',
  'Playlist',
  'Complete C Language course.',
  'Starting with programming concepts',
  'https://img.youtube.com/vi/rQoqCP7LX60/maxresdefault.jpg',
  array['C Language', 'Basics', 'Programming']
),
(
  '00000000-0000-0000-0000-000000000103',
  'Python Full Course',
  'https://youtu.be/UrsmFxEIp5k?si=YncVWzSPAXW0Ku5S',
  'youtube',
  'Playlist',
  'Complete Python learning course.',
  'Beginner friendly syntax',
  'https://img.youtube.com/vi/UrsmFxEIp5k/maxresdefault.jpg',
  array['Python', 'Beginner', 'Programming']
),
(
  '00000000-0000-0000-0000-000000000104',
  'Complete DSA Series',
  'https://youtu.be/VTLCoHnyACE?si=hPPA-4nphOFHuY5J',
  'youtube',
  'Playlist',
  'Complete Data Structures & Algorithms roadmap.',
  'Problem solving and optimization',
  'https://img.youtube.com/vi/VTLCoHnyACE/maxresdefault.jpg',
  array['DSA', 'Algorithms', 'Problem Solving']
),
(
  '00000000-0000-0000-0000-000000000105',
  'C++ Full Course',
  'https://youtu.be/e7sAf4SbS_g?si=v_hQalT02OZIJN5K',
  'youtube',
  'Playlist',
  'Complete C++ programming guide.',
  'OOP and Placement Prep',
  'https://img.youtube.com/vi/e7sAf4SbS_g/maxresdefault.jpg',
  array['C++', 'OOP', 'Placement Prep']
),
-- Practice website sheets
(
  '00000000-0000-0000-0000-000000000201',
  'Striver''s SDE Sheet (Take U Forward)',
  'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
  'website',
  'Curated sheet + Video support',
  'Strivers complete SDE roadmap sheet.',
  'Complete roadmap from basics to advanced',
  'https://takeuforward.org/wp-content/uploads/2021/08/takeuforward-logo.png',
  array['Curated', 'Video Support']
),
(
  '00000000-0000-0000-0000-000000000202',
  'Love Babbar DSA 450 Sheet',
  'https://450dsa.com/',
  'website',
  'Topic-wise categorized list',
  'Topic wise categorized checklist of 450 questions.',
  'Fixed checklist style revision',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Topic-wise', 'Checklist']
),
(
  '00000000-0000-0000-0000-000000000203',
  'NeetCode 150',
  'https://neetcode.io/practice',
  'website',
  'Patterns like DP, Graphs, Trees',
  'LeetCode patterns compilation.',
  'LeetCode-pattern mastery',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Patterns', 'LeetCode']
),
(
  '00000000-0000-0000-0000-000000000204',
  'Blind 75',
  'https://www.teamblind.com/post/Blind-75-LeetCode-Questions-8pdhm1h2',
  'website',
  'Only the most asked 75 questions',
  'Most asked coding interview questions list.',
  'Fastest FAANG-style prep',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['FAANG', 'Fast Prep']
),
(
  '00000000-0000-0000-0000-000000000205',
  'LeetCode Study Plans',
  'https://leetcode.com/study-plan/',
  'website',
  'Arrays, DP, SQL, Graphs tracks',
  'Guided daily structured practice tracks.',
  'Guided daily structured practice',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Structured', 'Daily Practice']
),
(
  '00000000-0000-0000-0000-000000000206',
  'InterviewBit Programming Path',
  'https://www.interviewbit.com/coding-interview-questions/',
  'website',
  'Level progression + hints',
  'Gamified programming level paths.',
  'Competitive interview-oriented prep',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Competitive', 'Gamified']
),
(
  '00000000-0000-0000-0000-000000000207',
  'GeeksforGeeks DSA Must-Do',
  'https://www.geeksforgeeks.org/must-do-coding-questions-for-product-based-companies/',
  'website',
  'Beginner-friendly',
  'Product based company preparation list.',
  'Topic explanation + questions',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Topic-wise', 'Explanations']
),
(
  '00000000-0000-0000-0000-000000000208',
  'Coding Ninjas Guided Paths',
  'https://www.codingninjas.com/codestudio/guided-paths',
  'website',
  'Incremental difficulty',
  'Topic-wise structured learning paths.',
  'Topic-wise structured lists',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Structured', 'Incremental']
),
(
  '00000000-0000-0000-0000-000000000209',
  'CS50 Harvard Problem Sets',
  'https://cs50.harvard.edu/x/2024/psets/',
  'website',
  'Strong conceptual base',
  'Harvard CS50 course problem sets.',
  'Logic + fundamentals',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Logic', 'Fundamentals']
),
(
  '00000000-0000-0000-0000-000000000210',
  'AlgoExpert',
  'https://www.algoexpert.io/',
  'website',
  'Coding + system design',
  'Polished video coding interview questions.',
  'Premium polished explanations',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80',
  array['Premium', 'System Design']
)
on conflict (id) do nothing;
