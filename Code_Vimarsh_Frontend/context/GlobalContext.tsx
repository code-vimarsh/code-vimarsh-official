import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { User, EventType, ProjectType, TeamMember, BlogPost, ManagedBlog, ManagedAchievement, AchievementType, AdminUser, VideoResource, LinkResource, Participant, ClubMember, Alum } from '../types';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_TEAM, MOCK_BLOGS, MOCK_MANAGED_BLOGS, MOCK_MANAGED_ACHIEVEMENTS, MOCK_ACHIEVEMENTS, MOCK_VIDEOS, MOCK_LINKS, MOCK_ALUMNI } from '../constants';
import { EVENTS_DATA } from '../data/eventsData';

const AUTH_KEY = 'cv_loggedin';

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  events: EventType[];
  addEvent: (event: EventType) => void;
  updateEvent: (event: EventType) => void;
  deleteEvent: (id: string) => void;
  projects: ProjectType[];
  addProject: (project: ProjectType) => void;
  updateProject: (project: ProjectType) => void;
  deleteProject: (id: string) => void;
  team: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  blogs: BlogPost[];
  managedBlogs: ManagedBlog[];
  addManagedBlog: (blog: ManagedBlog) => void;
  updateManagedBlog: (blog: ManagedBlog) => void;
  deleteManagedBlog: (id: string) => void;
  toggleBlogStatus: (id: string) => void;
  achievements: AchievementType[];
  managedAchievements: ManagedAchievement[];
  addManagedAchievement: (a: ManagedAchievement) => void;
  updateManagedAchievement: (a: ManagedAchievement) => void;
  deleteManagedAchievement: (id: string) => void;
  admins: AdminUser[];
  addAdmin: (admin: AdminUser) => void;
  deleteAdmin: (id: string) => void;
  videoResources: VideoResource[];
  addVideoResource: (video: VideoResource) => void;
  updateVideoResource: (video: VideoResource) => void;
  deleteVideoResource: (id: string) => void;
  linkResources: LinkResource[];
  addLinkResource: (link: LinkResource) => void;
  updateLinkResource: (link: LinkResource) => void;
  deleteLinkResource: (id: string) => void;
  // Bulk email registries
  participants: Participant[];
  addParticipant: (p: Participant) => void;
  removeParticipant: (id: string) => void;
  checkInParticipant: (id: string, status: 'registered' | 'attended') => void;
  clubMembers: ClubMember[];
  addClubMember: (m: ClubMember) => void;
  removeClubMember: (id: string) => void;
  alumni: Alum[];
  addAlum: (alum: Alum) => void;
  updateAlum: (alum: Alum) => void;
  deleteAlum: (id: string) => void;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Deduplicate team members by email (unique constraint)
const deduplicateTeamMembers = (members: TeamMember[]): TeamMember[] => {
  const seen = new Map<string, TeamMember>();
  
  members.forEach(member => {
    // Keep the first occurrence of each email
    if (!seen.has(member.email)) {
      seen.set(member.email, member);
    }
  });
  
  return Array.from(seen.values());
};

// ── Seed data ────────────────────────────────────────────────────────────────
const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Aarya Shah', email: 'aarya@example.com', eventId: 'evt-001', eventTitle: 'Open Source Sprint', registeredAt: '2025-01-10', status: 'registered', customAnswers: {} },
  { id: 'p2', name: 'Dev Mehta', email: 'dev@example.com', eventId: 'evt-001', eventTitle: 'Open Source Sprint', registeredAt: '2025-01-11', status: 'attended', customAnswers: {} },
  { id: 'p3', name: 'Riya Patel', email: 'riya@example.com', eventId: '2', eventTitle: 'DSA Bootcamp', registeredAt: '2025-02-01', status: 'registered', customAnswers: {} },
];

const MOCK_MEMBERS: ClubMember[] = [
  { id: 'm1', name: 'Aryan Buha', email: 'aryan@vimarsh.dev', role: 'Core Team', joinedAt: '2023-08-01' },
  { id: 'm2', name: 'Krish Modi', email: 'krish@vimarsh.dev', role: 'Member', joinedAt: '2024-01-15' },
  { id: 'm3', name: 'Pooja Joshi', email: 'pooja@vimarsh.dev', role: 'Alumni', joinedAt: '2022-07-20' },
];

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(!!localStorage.getItem(AUTH_KEY));
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const setIsLoggedIn = (v: boolean) => {
    setIsLoggedInState(v);
    if (v) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem('cv_token');
      localStorage.removeItem('cv_user_profile');
      setCurrentUser(null);
      (supabase.auth.signOut() as any).catch((err) => console.error('Supabase signout error:', err));
    }
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [managedBlogs, setManagedBlogs] = useState<ManagedBlog[]>([]);
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [managedAchievements, setManagedAchievements] = useState<ManagedAchievement[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [videoResources, setVideoResources] = useState<VideoResource[]>([]);
  const [linkResources, setLinkResources] = useState<LinkResource[]>([]);
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('cv_participants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cv_participants from localStorage:', e);
      }
    }
    return [];
  });
  useEffect(() => {
    const checkUserSession = async () => {
      if (isLoggedIn) {
        try {
          // Fetch active session from Supabase
          const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
          if (sessionErr) throw sessionErr;

          if (session?.user) {
            // Get user profile from Profiles table
            const { data: profile, error: profileErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (profileErr) throw profileErr;

            if (profile) {
              const mappedUser: User = {
                id: profile.id,
                prn: profile.prn || '',
                name: profile.full_name,
                email: profile.email,
                role: profile.role as any,
                github_url: profile.github_url || undefined,
                linkedin_url: profile.linkedin_url || undefined,
                leetcode_url: profile.leetcode_url || undefined,
                created_at: profile.created_at,
              };
              setCurrentUser(mappedUser);
              localStorage.setItem('cv_user_profile', JSON.stringify(mappedUser));
              return;
            }
          }
          throw new Error('No Supabase session or profile found.');
        } catch (err) {
          console.error('Supabase profile fetch failed, using local offline fallback:', err);
          // Fallback to local profile cache
          const savedProfile = localStorage.getItem('cv_user_profile');
          if (savedProfile) {
            try {
              setCurrentUser(JSON.parse(savedProfile));
            } catch (e) {
              // ignore
            }
          } else {
            setCurrentUser({
              id: 'mock_u1',
              prn: '220000000000',
              name: 'Deep Jaiswal',
              email: 'deep@vimarsh.dev',
              role: 'SUPER_ADMIN',
              github_url: 'https://github.com',
              linkedin_url: 'https://linkedin.com',
              leetcode_url: 'https://leetcode.com',
              created_at: new Date().toISOString(),
            });
          }
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkUserSession();
  }, [isLoggedIn]);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [alumni, setAlumni] = useState<Alum[]>(MOCK_ALUMNI);

  useEffect(() => {

    // Fetch events from Supabase directly
    (supabase
      .from('events') as any)
      .select('*')
      .order('start_date', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mappedEvents = data.map((e: any) => ({
            id: e.id?.toString(),
            title: e.title,
            date: e.start_date || e.date || new Date().toISOString(),
            type: e.event_type || 'Workshop',
            status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase() : 'Upcoming',
            description: e.description || '',
            long_description: e.long_description || '',
            image: e.banner_image || e.image || '',
            images: e.images || [],
            formFields: e.form_fields || [],
            isPublished: e.is_published ?? false,
            location: e.location || '',
            tags: e.topics || [],
            capacity: e.max_participants,
          }));
          setEvents(mappedEvents);
        }
      })
      .catch(err => {
        console.error('Failed to fetch events from Supabase, using mock events:', err);
      });

    // Fetch projects from Supabase directly
    (supabase
      .from('projects') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((p: any) => mapProjectFromBackend(p));
          setProjects(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch projects from Supabase:', err));

    // Fetch team from Supabase directly
    (supabase
      .from('team_members') as any)
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((m: any) => mapTeamMemberFromBackend(m));
          setTeam(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch team from Supabase:', err));

    // Fetch alumni from Supabase directly
    (supabase
      .from('alumni') as any)
      .select('*')
      .order('graduation_year', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((a: any) => mapAlumFromBackend(a));
          setAlumni(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch alumni from Supabase:', err));

    // Fetch blogs from Supabase directly
    (supabase
      .from('blogs') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((b: any) => mapBlogFromBackend(b));
          setManagedBlogs(mapped);
          
          // Set user-facing published blogs
          const published = mapped.filter((b: any) => b.status === 'Published').map((b: any) => ({
            id: b.id,
            title: b.title,
            excerpt: b.shortDescription,
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: b.authorName,
            tags: b.tags,
          }));
          setBlogs(published);
        }
      })
      .catch(err => console.error('Failed to fetch blogs from Supabase:', err));

    // Fetch achievements from Supabase directly
    (supabase
      .from('achievements') as any)
      .select('*')
      .order('order', { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((a: any) => mapAchievementFromBackend(a));
          setManagedAchievements(mapped);
          
          // Set user-facing achievements list
          const simple = mapped.map((a: any) => ({
            id: a.id,
            year: a.date ? a.date.split(' ').pop() || '2024' : '2024',
            title: a.title,
            description: a.description,
            category: a.tag || 'Hackathon',
          }));
          setAchievements(simple);
        }
      })
      .catch(err => console.error('Failed to fetch achievements from Supabase:', err));

    // Fetch resources from Supabase directly
    (supabase
      .from('resources') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((r: any) => mapResourceFromBackend(r));
          setVideoResources(mapped.filter((r: any) => r.category === 'youtube' || r.url.includes('youtube')));
          setLinkResources(mapped.filter((r: any) => r.category !== 'youtube' && !r.url.includes('youtube')));
        }
      })
      .catch(err => console.error('Failed to fetch resources from Supabase:', err));

    if (isLoggedIn) {
      (supabase
        .from('profiles')
        .select('*') as any)
        .then(({ data, error }) => {
          if (error) throw error;
          if (data) {
            setClubMembers(data.map((u: any) => ({
              id: u.id, name: u.full_name || u.name, email: u.email, role: u.role === 'USER' ? 'Member' : u.role, joinedAt: new Date(u.created_at).toISOString().split('T')[0]
            })));
            setAdmins(data.filter((u: any) => u.role === 'CONTENT_ADMIN' || u.role === 'SUPER_ADMIN').map((u: any) => ({
              id: u.id, name: u.full_name || u.name, email: u.email, role: u.role === 'CONTENT_ADMIN' ? 'Content Admin' : 'Super Admin', addedAt: new Date(u.created_at).toISOString().split('T')[0]
            })));
          }
        })
        .catch(err => console.error('Failed to fetch users from profiles:', err));

      // Direct Supabase query to get event registrations
      (supabase
        .from('event_registrations') as any)
        .select(`
          *,
          event:events(*)
        `)
        .then(({ data, error }) => {
          if (error) throw error;
          if (data) {
            const fetched = data.map((r: any) => ({
              id: r.id?.toString(),
              ticketCode: r.ticket_code || r.id?.toString().slice(0, 4),
              name: r.full_name,
              email: r.email,
              eventId: r.event_id,
              eventTitle: r.event?.title || 'Unknown Event',
              registeredAt: new Date(r.registered_at).toISOString().split('T')[0],
              status: (r.status || 'registered') as 'registered' | 'attended',
              customAnswers: r.custom_answers || {},
            }));
            setParticipants(prev => {
              const merged = [...prev];
              fetched.forEach((f: Participant) => {
                const idx = merged.findIndex(p => p.id === f.id);
                if (idx >= 0) {
                  if (merged[idx].status !== 'attended' && f.status === 'attended') {
                    merged[idx].status = 'attended';
                  }
                  merged[idx].customAnswers = f.customAnswers || merged[idx].customAnswers;
                } else {
                  merged.push(f);
                }
              });
              localStorage.setItem('cv_participants', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(err => console.error('Failed to fetch registrations from Supabase:', err));
    }
  }, [isLoggedIn]);

  const mapEventToPayload = (event: EventType) => {
    const slug = event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return {
      title: event.title,
      slug,
      description: event.description,
      long_description: event.long_description,
      type: event.type || 'Workshop',
      status: event.status || 'Upcoming',
      location: (event as any).location || '',
      start_date: event.date ? new Date(event.date).toISOString() : new Date().toISOString(),
      end_date: event.date ? new Date(event.date).toISOString() : new Date().toISOString(),
      banner_image: event.image || '',
      images: event.images || [],
      topics: (event as any).tags || [],
      max_participants: (event as any).capacity,
      form_fields: event.formFields || [],
      is_published: event.isPublished ?? false,
    };
  };

  const mapEventFromBackend = (e: any): EventType => ({
    id: e.id?.toString(),
    title: e.title,
    date: e.start_date || e.date || new Date().toISOString(),
    type: e.type || 'Workshop',
    status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase() : 'Upcoming',
    description: e.description || '',
    long_description: e.long_description || '',
    image: e.banner_image || e.image || '',
    images: e.images || [],
    formFields: e.form_fields || [],
    isPublished: e.is_published ?? false,
  });

  const addEvent = async (event: EventType) => {
    try {
      const payload = mapEventToPayload(event);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || currentUser?.id || 'unknown';

      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: payload.title,
          slug: payload.slug,
          description: payload.description,
          long_description: payload.long_description,
          event_type: payload.type,
          status: payload.status,
          location: payload.location,
          start_date: payload.start_date,
          end_date: payload.end_date,
          banner_image: payload.banner_image,
          topics: payload.topics,
          max_participants: payload.max_participants,
          form_fields: payload.form_fields,
          is_published: payload.is_published,
          created_by: userId,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const created = mapEventFromBackend(data);
        setEvents(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Supabase addEvent failed, falling back to local state:', err);
      setEvents(prev => [{ ...event, id: 'mock_' + Date.now() }, ...prev]);
    }
  };
  const updateEvent = async (event: EventType) => {
    try {
      const payload = mapEventToPayload(event);
      const { data, error } = await supabase
        .from('events')
        .update({
          title: payload.title,
          slug: payload.slug,
          description: payload.description,
          long_description: payload.long_description,
          event_type: payload.type,
          status: payload.status,
          location: payload.location,
          start_date: payload.start_date,
          end_date: payload.end_date,
          banner_image: payload.banner_image,
          topics: payload.topics,
          max_participants: payload.max_participants,
          form_fields: payload.form_fields,
          is_published: payload.is_published,
        })
        .eq('id', event.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const updated = mapEventFromBackend(data);
        setEvents(prev => prev.map(e => e.id === event.id ? updated : e));
      }
    } catch (err) {
      console.error('Supabase updateEvent failed, falling back to local state:', err);
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    }
  };
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Supabase deleteEvent failed, falling back to local state:', err);
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };
  const mapProjectFromBackend = (p: any): ProjectType => {
    const frontendCategoryMap: Record<string, string> = {
      'Web': 'Web',
      'App': 'Mobile',
      'AI': 'AI / ML',
      'Other': 'Systems'
    };
    return {
      id: p.id?.toString() || p._id || Math.random().toString(),
      title: p.title,
      description: p.short_description || p.description || '',
      category: (frontendCategoryMap[p.category] || 'Web') as any,
      tech: p.tech_stack || p.tech || [],
      image: p.image_url || p.image || '',
      author: p.author_name || p.author || 'Unknown',
      links: { github: p.github_link || p.github }
    };
  };

  const mapTeamMemberFromBackend = (m: any): TeamMember => ({
    id: m.id?.toString(),
    name: m.name,
    email: m.email || '',
    role: m.role || '',
    section: m.section as any,
    image: m.image || m.image_url || '',
    linkedin: m.linkedin || m.linkedin_url || '',
    github: m.github || m.github_url || '',
  });

  const mapAlumFromBackend = (a: any): Alum => ({
    id: a.id?.toString(),
    name: a.name,
    initials: a.initials || '',
    email: a.email || '',
    graduation_year: a.graduation_year || 0,
    batch: a.batch || '',
    role: a.role || '',
    company: a.company || '',
    location: a.location || '',
    domain: a.domain || 'Software Dev',
    bio: a.bio || '',
    advice: a.advice || '',
    linkedin: a.linkedin || '',
    github: a.github || '',
    website: a.website || '',
    photo: a.photo || '',
    tech: a.tech || [],
    achievements: a.achievements || [],
    roadmap: a.roadmap || [],
  });

  const mapBlogFromBackend = (b: any): ManagedBlog => ({
    id: b.id?.toString(),
    title: b.title,
    slug: b.slug,
    topic: b.topic || '',
    shortDescription: b.short_description || '',
    content: b.content || '',
    featuredImage: b.featured_image || b.featured_image_url || '',
    images: b.images || [],
    authorName: b.author_name || 'Unknown',
    authorRole: b.author_role || 'Guest',
    tags: b.tags || [],
    status: b.status || 'Draft',
    createdAt: b.created_at || new Date().toISOString(),
    updatedAt: b.updated_at || new Date().toISOString(),
  });

  const mapAchievementFromBackend = (a: any): ManagedAchievement => ({
    id: a.id?.toString(),
    title: a.title,
    description: a.description || '',
    date: a.date || '',
    tag: a.tag || '',
    icon: a.icon || '',
    category: a.category || '',
    order: a.order || a.sort_order || 0,
    createdAt: a.created_at || new Date().toISOString(),
    updatedAt: a.updated_at || new Date().toISOString(),
  });

  const mapResourceFromBackend = (r: any) => ({
    id: r.id?.toString(),
    title: r.title,
    category: r.category || 'website',
    url: r.url || '',
    thumbnail: r.thumbnail || r.thumbnail_url || '',
    tags: r.tags || [],
    bestFor: r.best_for || '',
    type: r.content_type || '',
    contentType: r.content_type || ''
  });

  const addProject = async (project: ProjectType) => {
    const backendCategoryMap: Record<string, string> = {
      'Web': 'Web',
      'Mobile': 'App',
      'AI / ML': 'AI',
      'Systems': 'Other',
      'Open Source': 'Other'
    };
    try {
      // Get the current user id for created_by (required field)
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || currentUser?.id || 'unknown';

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: project.title,
          short_description: project.description,
          category: backendCategoryMap[project.category] || 'Other',
          tech_stack: project.tech || [],
          github_link: project.links?.github || '',
          image: project.image || '',
          author_name: project.author || 'Unknown',
          created_by: userId,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProjects(prev => [mapProjectFromBackend(data), ...prev]);
      }
    } catch (err) {
      console.error('Supabase addProject failed, falling back to local state:', err);
      setProjects(prev => [{ ...project, id: 'mock_' + Date.now() }, ...prev]);
    }
  };
  const updateProject = async (project: ProjectType) => {
    const backendCategoryMap: Record<string, string> = {
      'Web': 'Web',
      'Mobile': 'App',
      'AI / ML': 'AI',
      'Systems': 'Other',
      'Open Source': 'Other'
    };
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          short_description: project.description,
          category: backendCategoryMap[project.category] || 'Other',
          tech_stack: project.tech || [],
          github_link: project.links?.github || '',
          image: project.image || '',
          author_name: project.author || 'Unknown',
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const updated = mapProjectFromBackend(data);
        setProjects(prev => prev.map(p => p.id === project.id ? updated : p));
      }
    } catch (err) {
      console.error('Supabase updateProject failed, falling back to local state:', err);
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    }
  };
  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Supabase deleteProject failed, falling back to local state:', err);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };
  const addAdmin = (admin: AdminUser) => setAdmins(prev => [admin, ...prev]);
  const deleteAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'USER' })
        .eq('id', id);

      if (error) throw error;
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Supabase deleteAdmin failed:', err);
    }
  };

  const mapBlogToPayload = (blog: ManagedBlog) => ({
    title: blog.title,
    slug: blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now(),
    topic: blog.topic,
    short_description: blog.shortDescription,
    content: blog.content,
    featured_image: blog.featuredImage,
    images: blog.images || [],
    author_name: blog.authorName,
    author_role: blog.authorRole,
    tags: blog.tags,
    status: blog.status,
  });

  const addManagedBlog = async (blog: ManagedBlog) => {
    const payload = mapBlogToPayload(blog);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setManagedBlogs(prev => [{
          ...blog,
          id: data.id,
          slug: data.slug || blog.slug,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        }, ...prev]);
      }
    } catch (err) {
      console.error('Supabase addManagedBlog failed:', err);
      setManagedBlogs(prev => [{ ...blog, id: 'mock_' + Date.now() }, ...prev]);
    }
  };
  const updateManagedBlog = async (blog: ManagedBlog) => {
    const payload = mapBlogToPayload(blog);
    try {
      const { error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', blog.id);

      if (error) throw error;
      setManagedBlogs(prev => prev.map(b => b.id === blog.id ? { ...blog, updatedAt: new Date().toISOString() } : b));
    } catch (err) {
      console.error('Supabase updateManagedBlog failed:', err);
      setManagedBlogs(prev => prev.map(b => b.id === blog.id ? { ...blog, updatedAt: new Date().toISOString() } : b));
    }
  };
  const deleteManagedBlog = async (id: string) => {
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      setManagedBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Supabase deleteManagedBlog failed:', err);
      setManagedBlogs(prev => prev.filter(b => b.id !== id));
    }
  };
  const toggleBlogStatus = async (id: string) => {
    const blog = managedBlogs.find(b => b.id === id);
    if (!blog) return;
    const newStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setManagedBlogs(prev => prev.map(b =>
        b.id === id ? { ...b, status: newStatus as any, updatedAt: new Date().toISOString() } : b
      ));
    } catch (err) {
      console.error('Supabase toggleBlogStatus failed:', err);
      setManagedBlogs(prev => prev.map(b =>
        b.id === id ? { ...b, status: newStatus as any, updatedAt: new Date().toISOString() } : b
      ));
    }
  };

  const addManagedAchievement = async (a: ManagedAchievement) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert([{
          title: a.title,
          description: a.description,
          date: a.date,
          tag: a.tag,
          icon: a.icon,
          category: a.category,
          order: a.order || 0,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const mapped = mapAchievementFromBackend(data);
        setManagedAchievements(prev => [...prev, mapped].sort((x, y) => x.order - y.order));
      }
    } catch (err) {
      console.error('Supabase addManagedAchievement failed:', err);
      setManagedAchievements(prev => [...prev, { ...a, id: 'mock_' + Date.now() }].sort((x, y) => x.order - y.order));
    }
  };
  const updateManagedAchievement = async (a: ManagedAchievement) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .update({
          title: a.title,
          description: a.description,
          date: a.date,
          tag: a.tag,
          icon: a.icon,
          category: a.category,
          order: a.order || 0,
        })
        .eq('id', a.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const mapped = mapAchievementFromBackend(data);
        setManagedAchievements(prev => prev.map(x => x.id === a.id ? mapped : x).sort((x, y) => x.order - y.order));
      }
    } catch (err) {
      console.error('Supabase updateManagedAchievement failed:', err);
      setManagedAchievements(prev => prev.map(x => x.id === a.id ? a : x).sort((x, y) => x.order - y.order));
    }
  };
  const deleteManagedAchievement = async (id: string) => {
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      setManagedAchievements(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error('Supabase deleteManagedAchievement failed:', err);
      setManagedAchievements(prev => prev.filter(x => x.id !== id));
    }
  };

  const addVideoResource = async (video: VideoResource) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: video.title,
          category: 'youtube',
          url: video.url || '',
          thumbnail: (video as any).thumbnail || '',
          tags: video.tags || [],
          best_for: video.bestFor || '',
          content_type: (video as any).contentType || (video as any).type || '',
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setVideoResources(prev => [mapResourceFromBackend(data), ...prev]);
      }
    } catch (err) {
      console.error('Supabase addVideoResource failed:', err);
      setVideoResources(prev => [{ ...video, id: 'mock_' + Date.now() }, ...prev]);
    }
  };
  const updateVideoResource = async (video: VideoResource) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({
          title: video.title,
          category: 'youtube',
          url: video.url || '',
          thumbnail: (video as any).thumbnail || '',
          tags: video.tags || [],
          best_for: video.bestFor || '',
          content_type: (video as any).contentType || (video as any).type || '',
        })
        .eq('id', video.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setVideoResources(prev => prev.map(v => v.id === video.id ? mapResourceFromBackend(data) : v));
      }
    } catch (err) {
      console.error('Supabase updateVideoResource failed:', err);
      setVideoResources(prev => prev.map(v => v.id === video.id ? video : v));
    }
  };
  const deleteVideoResource = async (id: string) => {
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setVideoResources(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Supabase deleteVideoResource failed:', err);
      setVideoResources(prev => prev.filter(v => v.id !== id));
    }
  };

  const addLinkResource = async (link: LinkResource) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: link.title,
          category: link.category || 'website',
          url: link.url || '',
          thumbnail: (link as any).thumbnail || '',
          tags: link.tags || [],
          best_for: link.bestFor || '',
          content_type: link.contentType || (link as any).type || '',
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setLinkResources(prev => [mapResourceFromBackend(data), ...prev]);
      }
    } catch (err) {
      console.error('Supabase addLinkResource failed:', err);
      setLinkResources(prev => [{ ...link, id: 'mock_' + Date.now() }, ...prev]);
    }
  };
  const updateLinkResource = async (link: LinkResource) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({
          title: link.title,
          category: link.category || 'website',
          url: link.url || '',
          thumbnail: (link as any).thumbnail || '',
          tags: link.tags || [],
          best_for: link.bestFor || '',
          content_type: link.contentType || (link as any).type || '',
        })
        .eq('id', link.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setLinkResources(prev => prev.map(l => l.id === link.id ? mapResourceFromBackend(data) : l));
      }
    } catch (err) {
      console.error('Supabase updateLinkResource failed:', err);
      setLinkResources(prev => prev.map(l => l.id === link.id ? link : l));
    }
  };
  const deleteLinkResource = async (id: string) => {
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setLinkResources(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Supabase deleteLinkResource failed:', err);
      setLinkResources(prev => prev.filter(l => l.id !== id));
    }
  };

  const addParticipant = (p: Participant) => {
    setParticipants(prev => {
      const updated = [p, ...prev];
      localStorage.setItem('cv_participants', JSON.stringify(updated));
      return updated;
    });
    // Sync to Supabase directly
    supabase
      .from('event_registrations')
      .insert([{
        event_id: p.eventId,
        full_name: p.name,
        email: p.email,
        status: p.status,
        custom_answers: p.customAnswers || {}
      }])
      .then(({ error }) => {
        if (error) console.warn('Failed to sync registration to Supabase:', error);
      });
  };
  const removeParticipant = (id: string) => {
    setParticipants(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('cv_participants', JSON.stringify(updated));
      return updated;
    });
  };
  const checkInParticipant = (id: string, status: 'registered' | 'attended') => {
    setParticipants(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status } : p);
      localStorage.setItem('cv_participants', JSON.stringify(updated));
      return updated;
    });

    // Sync check-in state directly with Supabase
    supabase
      .from('event_registrations')
      .update({ status })
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Failed to sync check-in status to Supabase:', error);
        }
      });
  };

  const addTeamMember = async (member: TeamMember) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          name: member.name,
          role: member.role,
          section: member.section,
          image_url: member.image || '',
          email: member.email,
          linkedin_url: member.linkedin || '',
          github_url: member.github || '',
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTeam(prev => [...prev, mapTeamMemberFromBackend(data)]);
      }
    } catch (err) {
      console.error('Supabase addTeamMember failed:', err);
      setTeam(prev => [...prev, { ...member, id: 'mock_' + Date.now() }]);
    }
  };
  const updateTeamMember = async (member: TeamMember) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({
          name: member.name,
          role: member.role,
          section: member.section,
          image_url: member.image || '',
          email: member.email,
          linkedin_url: member.linkedin || '',
          github_url: member.github || '',
        })
        .eq('id', member.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTeam(prev => prev.map(m => m.id === member.id ? mapTeamMemberFromBackend(data) : m));
      }
    } catch (err) {
      console.error('Supabase updateTeamMember failed:', err);
      setTeam(prev => prev.map(m => m.id === member.id ? member : m));
    }
  };
  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      setTeam(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Supabase deleteTeamMember failed:', err);
      setTeam(prev => prev.filter(m => m.id !== id));
    }
  };

  const addClubMember = (m: ClubMember) => setClubMembers(prev => [m, ...prev]);
  const removeClubMember = (id: string) => setClubMembers(prev => prev.filter(m => m.id !== id));

  const addAlum = async (alum: Alum) => {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .insert([{
          name: alum.name,
          initials: alum.initials || '',
          photo: alum.photo || '',
          role: alum.role,
          company: alum.company,
          batch: alum.batch,
          location: alum.location,
          domain: alum.domain,
          bio: alum.bio || '',
          advice: alum.advice || '',
          tech: alum.tech || [],
          linkedin: alum.linkedin || '',
          github: alum.github || '',
          website: alum.website || '',
          achievements: alum.achievements || [],
          roadmap: alum.roadmap || null,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setAlumni(prev => [mapAlumFromBackend(data), ...prev]);
      }
    } catch (err) {
      console.error('Supabase addAlum failed:', err);
      setAlumni(prev => [{ ...alum, id: 'mock_' + Date.now() }, ...prev]);
    }
  };
  const updateAlum = async (alum: Alum) => {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .update({
          name: alum.name,
          initials: alum.initials || '',
          photo: alum.photo || '',
          role: alum.role,
          company: alum.company,
          batch: alum.batch,
          location: alum.location,
          domain: alum.domain,
          bio: alum.bio || '',
          advice: alum.advice || '',
          tech: alum.tech || [],
          linkedin: alum.linkedin || '',
          github: alum.github || '',
          website: alum.website || '',
          achievements: alum.achievements || [],
          roadmap: alum.roadmap || null,
        })
        .eq('id', alum.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setAlumni(prev => prev.map(a => a.id === alum.id ? mapAlumFromBackend(data) : a));
      }
    } catch (err) {
      console.error('Supabase updateAlum failed:', err);
      setAlumni(prev => prev.map(a => a.id === alum.id ? alum : a));
    }
  };
  const deleteAlum = async (id: string) => {
    try {
      const { error } = await supabase.from('alumni').delete().eq('id', id);
      if (error) throw error;
      setAlumni(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Supabase deleteAlum failed:', err);
      setAlumni(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <GlobalContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      events, addEvent, updateEvent, deleteEvent,
      projects, addProject, updateProject, deleteProject,
      team, addTeamMember, updateTeamMember, deleteTeamMember,
      blogs, achievements,
      managedBlogs, addManagedBlog, updateManagedBlog, deleteManagedBlog, toggleBlogStatus,
      managedAchievements, addManagedAchievement, updateManagedAchievement, deleteManagedAchievement,
      admins, addAdmin, deleteAdmin,
      videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
      linkResources, addLinkResource, updateLinkResource, deleteLinkResource,
      participants, addParticipant, removeParticipant, checkInParticipant,
      clubMembers, addClubMember, removeClubMember,
      alumni, addAlum, updateAlum, deleteAlum,
      currentUser, setCurrentUser,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
};