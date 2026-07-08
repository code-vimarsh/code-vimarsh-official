-- Enable UUID generation
create extension if not exists pgcrypto;

-- Users profile table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  prn text unique,
  full_name text not null, -- Frontend maps to name
  email text unique not null,
  role text not null default 'USER' check (role in ('USER','CONTENT_ADMIN','SUPER_ADMIN')),
  avatar_url text, -- Frontend maps to avatar
  avatar_public_id text,
  github_url text,
  linkedin_url text,
  leetcode_url text,
  is_verified boolean default false,
  -- Frontend expects xp and level fields for gamification
  xp integer default 0,
  level integer default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Email verification OTP table
create table if not exists public.email_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  code_hash text not null,
  purpose text not null default 'signup' check (purpose in ('signup','password_reset')),
  expires_at timestamptz not null,
  attempts integer default 0,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  long_description text,
  event_type text default 'Workshop',
  status text default 'Upcoming',
  location text,
  start_date timestamptz,
  end_date timestamptz,
  banner_image_url text, -- Frontend maps to image
  banner_public_id text,
  images jsonb default '[]'::jsonb, -- Gallery images URL list
  topics text[] default '{}', -- Frontend maps to tags
  max_participants integer, -- Frontend maps to capacity
  form_fields jsonb default '[]'::jsonb, -- Dynamic registration fields configuration
  is_published boolean default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Event registrations table
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  custom_answers jsonb default '{}'::jsonb, -- Contains all dynamic form fields answers
  status text default 'registered',
  registered_at timestamptz not null default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text,
  full_description text, -- Added: Stores the expanded description
  features text[] default '{}', -- Added: Bullet points of key features
  category text, -- E.g. Web, App, AI, Other
  tech_stack text[] default '{}',
  github_link text,
  live_link text, -- Added: Live demo website link
  image_url text, -- Frontend maps to image
  image_public_id text,
  images jsonb default '[]'::jsonb, -- Added: Gallery images
  author_name text, -- Frontend maps to author
  is_published boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Team members table
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  role text, -- Specific title (e.g. President, Vice President)
  section text not null check (section in ('Team Leads', 'Web Team', 'Management', 'Design Team')), -- Added: Required for UI category grouping
  bio text,
  github_url text, -- Frontend maps to github
  linkedin_url text, -- Frontend maps to linkedin
  image_url text, -- Frontend maps to image
  image_public_id text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

-- Alumni table
create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  initials text,
  email text,
  graduation_year integer,
  batch text,
  role text, -- Renamed from current_role to role to match frontend types exactly
  company text,
  location text,
  domain text, -- Domain type
  bio text,
  advice text,
  linkedin text, -- Renamed from linkedin_url to linkedin to match frontend types exactly
  github text, -- Renamed from github_url to github to match frontend types exactly
  website text, -- Renamed from website_url to website to match frontend types exactly
  photo text, -- Renamed from image_url to photo to match frontend types exactly
  image_public_id text,
  tech text[] default '{}',
  achievements text[] default '{}',
  roadmap jsonb default '[]'::jsonb, -- Stores step-by-step roadmap array
  is_featured boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blogs table
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  topic text,
  short_description text,
  content text,
  featured_image_url text, -- Frontend maps to featuredImage
  featured_image_public_id text,
  images jsonb default '[]'::jsonb,
  author_name text,
  author_role text,
  tags text[] default '{}',
  status text default 'Draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Achievements table
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  image_public_id text,
  year integer,
  achievement_type text,
  sort_order integer default 0, -- Frontend maps to order
  is_featured boolean default false,
  -- Frontend-specific fields for ManagedAchievement
  date text,
  tag text,
  icon text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Resources table
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  category text not null, -- 'youtube' or 'website'
  content_type text, -- Frontend maps to type
  description text,
  best_for text, -- Frontend maps to bestFor
  thumbnail_url text, -- Frontend maps to thumbnail
  thumbnail_public_id text,
  tags text[] default '{}', -- Added: Resource tags list
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Contact messages table
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'new',
  submitted_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_blogs_status on public.blogs(status);
create index if not exists idx_registrations_event on public.event_registrations(event_id);
create index if not exists idx_resources_category on public.resources(category);
create index if not exists idx_alumni_featured on public.alumni(is_featured);
create index if not exists idx_achievements_order on public.achievements(sort_order);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.projects enable row level security;
alter table public.team_members enable row level security;
alter table public.alumni enable row level security;
alter table public.blogs enable row level security;
alter table public.achievements enable row level security;
alter table public.resources enable row level security;
alter table public.contacts enable row level security;
alter table public.event_registrations enable row level security;

-- Public read access for content tables
create policy "Public read access for events" on public.events for select using (true);
create policy "Public read access for projects" on public.projects for select using (true);
create policy "Public read access for team" on public.team_members for select using (true);
create policy "Public read access for alumni" on public.alumni for select using (true);
create policy "Public read access for published blogs" on public.blogs for select using (status = 'Published');
create policy "Public read access for achievements" on public.achievements for select using (true);
create policy "Public read access for resources" on public.resources for select using (true);
create policy "Public read access for profiles" on public.profiles for select using (true);

-- Event registrations policies
create policy "Public can create registrations" on public.event_registrations for insert with check (true);
create policy "Users can view own registrations" on public.event_registrations for select using (user_id in (select id from public.profiles where user_id = auth.uid()));
create policy "Admins can manage registrations" on public.event_registrations for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));

-- Admin write access policies (to be implemented with Supabase Auth role mappings)
create policy "Admin write access for events" on public.events for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));
create policy "Admin write access for projects" on public.projects for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));
create policy "Admin write access for team" on public.team_members for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));
create policy "Admin write access for alumni" on public.alumni for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));
create policy "Admin write access for blogs" on public.blogs for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));
create policy "Admin write access for achievements" on public.achievements for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));
create policy "Admin write access for resources" on public.resources for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));

-- Users can update their own profile
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);

-- Public can submit contact messages
create policy "Public can create contact" on public.contacts for insert with check (true);

-- Admin can view contact messages
create policy "Admin can view contacts" on public.contacts for select using (exists (select 1 from public.profiles where user_id = auth.uid() and role in ('CONTENT_ADMIN', 'SUPER_ADMIN')));

-- Trigger to automatically create a profile for new auth.users upon signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name, prn, role, xp, level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'prn',
    'USER',
    0,
    1
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
