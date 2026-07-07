import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
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
  updateParticipantStatus: (id: string, status: 'Registered' | 'Attended' | 'Cancelled') => void;
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
  {
    id: 'reg-001',
    name: 'Aarya Shah',
    email: 'aarya@example.com',
    eventId: 'evt-6',
    eventTitle: 'Workshop on Open Source Contribution',
    registeredAt: '2026-02-10',
    status: 'Registered',
    whatsapp_number: '+91 98765 43210',
    github_username: 'aaryashah',
    experience_level: 'Beginner'
  },
  {
    id: 'reg-002',
    name: 'Dev Mehta',
    email: 'dev@example.com',
    eventId: 'evt-6',
    eventTitle: 'Workshop on Open Source Contribution',
    registeredAt: '2026-02-10',
    status: 'Registered',
    whatsapp_number: '+91 87654 32109',
    github_username: 'devmehta',
    experience_level: 'Intermediate'
  },
  {
    id: 'reg-003',
    name: 'Riya Patel',
    email: 'riya@example.com',
    eventId: 'evt-6',
    eventTitle: 'Workshop on Open Source Contribution',
    registeredAt: '2026-02-11',
    status: 'Registered',
    whatsapp_number: '+91 76543 21098',
    github_username: 'riyapatel',
    experience_level: 'Beginner'
  },
  {
    id: 'reg-004',
    name: 'Ketan Vyas',
    email: 'ketan@example.com',
    eventId: 'evt-6',
    eventTitle: 'Workshop on Open Source Contribution',
    registeredAt: '2026-02-11',
    status: 'Attended',
    whatsapp_number: '+91 65432 10987',
    github_username: 'ketanvyas',
    experience_level: 'Advanced'
  },
  {
    id: 'reg-005',
    name: 'Nisha Sharma',
    email: 'nisha@example.com',
    eventId: 'evt-5',
    eventTitle: 'Post Contest discussion for Leetcode weekly contest',
    registeredAt: '2026-02-07',
    status: 'Registered',
    whatsapp_number: '+91 54321 09876',
    github_username: 'nishasharma',
    experience_level: 'Intermediate'
  }
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
    if (v) localStorage.setItem(AUTH_KEY, 'true');
    else localStorage.removeItem(AUTH_KEY);
  };

  const [events, setEvents] = useState<EventType[]>(EVENTS_DATA as any);
  const [projects, setProjects] = useState<ProjectType[]>(MOCK_PROJECTS as any);
  const [team, setTeam] = useState<TeamMember[]>(deduplicateTeamMembers(MOCK_TEAM));
  const [blogs, setBlogs] = useState<BlogPost[]>(MOCK_BLOGS);
  const [managedBlogs, setManagedBlogs] = useState<ManagedBlog[]>(MOCK_MANAGED_BLOGS);
  const [achievements, setAchievements] = useState<AchievementType[]>(MOCK_ACHIEVEMENTS);
  const [managedAchievements, setManagedAchievements] = useState<ManagedAchievement[]>(MOCK_MANAGED_ACHIEVEMENTS);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [videoResources, setVideoResources] = useState<VideoResource[]>(MOCK_VIDEOS);
  const [linkResources, setLinkResources] = useState<LinkResource[]>(MOCK_LINKS);
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [alumni, setAlumni] = useState<Alum[]>(MOCK_ALUMNI);

  useEffect(() => {
    if (isLoggedIn) {
      api.get('/auth/me')
        .then(res => {
          if (res.data.success && res.data.user) {
            setCurrentUser(res.data.user);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          if (err.response?.status === 401) {
            setIsLoggedIn(false);
          }
        });
    } else {
      setCurrentUser(null);
    }

    // Fetch events from backend
    api.get('/events')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.events)) {
          const mappedEvents = res.data.events.map((e: any) => ({
            id: e.id?.toString() || e._id || Math.random().toString(),
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
            location: e.location || '',
            tags: e.topics || [],
            capacity: e.max_participants,
          }));
          if (mappedEvents.length > 0) setEvents(mappedEvents);
        }
      })
      .catch(err => console.error('Failed to fetch events:', err));

    // Fetch projects from backend
    api.get('/projects')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const mappedProjects = res.data.data.map((p: any) => mapProjectFromBackend(p));
          if (mappedProjects.length > 0) setProjects(mappedProjects);
        }
      })
      .catch(err => console.error('Failed to fetch projects:', err));

    api.get('/team').then(res => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const deduped = deduplicateTeamMembers(res.data.data);
        setTeam(deduped);
      }
    }).catch(err => console.error('Failed to fetch team:', err));

    api.get('/alumni').then(res => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setAlumni(res.data.data);
      }
    }).catch(err => console.error('Failed to fetch alumni:', err));

    api.get('/blogs').then(res => {
      if (res.data.success && Array.isArray(res.data.data)) {
        const mappedBlogs: ManagedBlog[] = res.data.data.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          topic: b.topic,
          shortDescription: b.short_description || '',
          content: b.content || '',
          featuredImage: b.featured_image || '',
          images: b.images || [],
          authorName: b.author_name || 'Unknown',
          authorRole: b.author_role || 'Guest',
          tags: b.tags || [],
          status: b.status || 'Draft',
          createdAt: b.created_at || new Date().toISOString(),
          updatedAt: b.updated_at || new Date().toISOString(),
        }));
        if (mappedBlogs.length > 0) setManagedBlogs(mappedBlogs);
      }
    }).catch(err => console.error('Failed to fetch blogs:', err));

    api.get('/achievements').then(res => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setManagedAchievements(res.data.data);
      }
    }).catch(err => console.error('Failed to fetch achievements:', err));

    api.get('/resources').then(res => {
      if (res.data.success) {
        const mappedData = res.data.data.map((r: any) => ({
          ...r,
          bestFor: r.best_for,
          type: r.content_type
        }));
        if (mappedData.length > 0) {
          setVideoResources(mappedData.filter((r: any) => r.category === 'youtube' || r.url.includes('youtube')));
          setLinkResources(mappedData.filter((r: any) => r.category !== 'youtube' && !r.url.includes('youtube')));
        }
      }
    }).catch(err => console.error('Failed to fetch resources:', err));

    if (isLoggedIn) {
      api.get('/admin/users').then(res => {
        if (res.data.success) {
          const users = res.data.users;
          setClubMembers(users.map((u: any) => ({
            id: u.id, name: u.name, email: u.email, role: u.role === 'USER' ? 'Member' : u.role, joinedAt: new Date(u.created_at).toISOString().split('T')[0]
          })));
          setAdmins(users.filter((u: any) => u.role === 'CONTENT_ADMIN' || u.role === 'SUPER_ADMIN').map((u: any) => ({
            id: u.id, name: u.name, email: u.email, role: u.role === 'CONTENT_ADMIN' ? 'Content Admin' : 'Super Admin', addedAt: new Date(u.created_at).toISOString().split('T')[0]
          })));
        }
      }).catch(err => console.error('Failed to fetch users:', err));

      api.get('/events/registrations').then(res => {
        if (res.data.success) {
          const saved = localStorage.getItem('cv_participant_statuses');
          const localMap = saved ? JSON.parse(saved) : {};

          setParticipants(res.data.registrations.map((r: any) => ({
            id: r.id,
            name: r.full_name,
            email: r.email,
            eventId: r.event_id,
            eventTitle: r.event?.title || 'Unknown Event',
            registeredAt: new Date(r.registered_at).toISOString().split('T')[0],
            status: localMap[r.id] || r.status || 'Registered',
            whatsapp_number: r.whatsapp_number || '',
            github_username: r.github_username || '',
            experience_level: r.experience_level || '',
          })));
        }
      }).catch(err => console.error('Failed to fetch registrations:', err));
    }
  }, [isLoggedIn]);

  const mapEventToPayload = (event: EventType) => ({
    title: event.title,
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
  });

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

  const addEvent = (event: EventType) => {
    const payload = mapEventToPayload(event);
    api.post('/events', payload).then(res => {
      const created = mapEventFromBackend(res.data.event || res.data.data || res.data);
      setEvents(prev => [created, ...prev]);
    }).catch(err => {
      console.warn('API error adding event, falling back to client-side state update:', err);
      const created = { ...event, id: event.id || 'local_' + Date.now() };
      setEvents(prev => [created, ...prev]);
    });
  };
  const updateEvent = (event: EventType) => {
    const payload = mapEventToPayload(event);
    api.put(`/events/${event.id}`, payload).then(res => {
      const updated = mapEventFromBackend(res.data.event || res.data.data || res.data);
      setEvents(prev => prev.map(e => e.id === event.id ? updated : e));
    }).catch(err => {
      console.warn('API error updating event, falling back to client-side state update:', err);
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    });
  };
  const deleteEvent = (id: string) => {
    api.delete(`/events/${id}`).then(() => setEvents(prev => prev.filter(e => e.id !== id))).catch(err => {
      console.warn('API error deleting event, falling back to client-side state update:', err);
      setEvents(prev => prev.filter(e => e.id !== id));
    });
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
      image: p.image || '',
      author: p.author_name || p.author || 'Unknown',
      links: { github: p.github_link || p.github }
    };
  };

  const addProject = (project: ProjectType) => {
    const backendCategoryMap: Record<string, string> = {
      'Web': 'Web',
      'Mobile': 'App',
      'AI / ML': 'AI',
      'Systems': 'Other',
      'Open Source': 'Other'
    };
    const payload = {
      title: project.title,
      short_description: project.description,
      category: backendCategoryMap[project.category] || 'Other',
      tech_stack: project.tech,
      github_link: project.links?.github,
      image: project.image,
      author_name: project.author
    };
    api.post('/projects', payload).then(res => setProjects(prev => [mapProjectFromBackend(res.data.data), ...prev])).catch(console.error);
  };
  const deleteProject = (id: string) => {
    api.delete(`/projects/${id}`).then(() => setProjects(prev => prev.filter(p => p.id !== id))).catch(console.error);
  };
  const addAdmin = (admin: AdminUser) => setAdmins(prev => [admin, ...prev]);
  const deleteAdmin = (id: string) => {
    api.patch(`/admin/users/${id}/role`, { role: 'USER' })
      .then(res => {
        if (res.data.success) {
          setAdmins(prev => prev.filter(a => a.id !== id));
        }
      }).catch(console.error);
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

  const addManagedBlog = (blog: ManagedBlog) => {
    const payload = mapBlogToPayload(blog);
    api.post('/blogs', payload).then(res => {
      const created = res.data.data;
      setManagedBlogs(prev => [{
        ...blog,
        id: created.id,
        slug: created.slug || blog.slug,
        createdAt: created.created_at || new Date().toISOString(),
        updatedAt: created.updated_at || new Date().toISOString(),
      }, ...prev]);
    }).catch(console.error);
  };
  const updateManagedBlog = (blog: ManagedBlog) => {
    const payload = mapBlogToPayload(blog);
    api.put(`/blogs/${blog.id}`, payload).then(() => {
      setManagedBlogs(prev => prev.map(b => b.id === blog.id ? { ...blog, updatedAt: new Date().toISOString() } : b));
    }).catch(console.error);
  };
  const deleteManagedBlog = (id: string) => {
    api.delete(`/blogs/${id}`).then(() => setManagedBlogs(prev => prev.filter(b => b.id !== id))).catch(console.error);
  };
  const toggleBlogStatus = (id: string) => {
    const blog = managedBlogs.find(b => b.id === id);
    if (!blog) return;
    const newStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    api.put(`/blogs/${id}`, { status: newStatus }).then(() => {
      setManagedBlogs(prev => prev.map(b =>
        b.id === id ? { ...b, status: newStatus as any, updatedAt: new Date().toISOString() } : b
      ));
    }).catch(console.error);
  };

  const addManagedAchievement = (a: ManagedAchievement) => {
    api.post('/achievements', a).then(res => setManagedAchievements(prev => [...prev, res.data.data].sort((x, y) => x.order - y.order))).catch(console.error);
  };
  const updateManagedAchievement = (a: ManagedAchievement) => {
    api.put(`/achievements/${a.id}`, a).then(res => setManagedAchievements(prev => prev.map(x => x.id === a.id ? res.data.data : x).sort((x, y) => x.order - y.order))).catch(console.error);
  };
  const deleteManagedAchievement = (id: string) => {
    api.delete(`/achievements/${id}`).then(() => setManagedAchievements(prev => prev.filter(x => x.id !== id))).catch(console.error);
  };

  const addVideoResource = (video: VideoResource) => {
    api.post('/resources', { ...video, best_for: video.bestFor, category: 'youtube' }).then(res => {
      const added = { ...res.data.data, bestFor: res.data.data.best_for, type: res.data.data.content_type };
      setVideoResources(prev => [added, ...prev]);
    }).catch(console.error);
  };
  const updateVideoResource = (video: VideoResource) => {
    api.put(`/resources/${video.id}`, { ...video, best_for: video.bestFor, category: 'youtube' }).then(res => {
      const updated = { ...res.data.data, bestFor: res.data.data.best_for, type: res.data.data.content_type };
      setVideoResources(prev => prev.map(v => v.id === video.id ? updated : v));
    }).catch(console.error);
  };
  const deleteVideoResource = (id: string) => {
    api.delete(`/resources/${id}`).then(() => setVideoResources(prev => prev.filter(v => v.id !== id))).catch(console.error);
  };

  const addLinkResource = (link: LinkResource) => {
    api.post('/resources', { ...link, content_type: link.type, category: 'website' }).then(res => {
      const added = { ...res.data.data, bestFor: res.data.data.best_for, type: res.data.data.content_type };
      setLinkResources(prev => [added, ...prev]);
    }).catch(console.error);
  };
  const updateLinkResource = (link: LinkResource) => {
    api.put(`/resources/${link.id}`, { ...link, content_type: link.type, category: 'website' }).then(res => {
      const updated = { ...res.data.data, bestFor: res.data.data.best_for, type: res.data.data.content_type };
      setLinkResources(prev => prev.map(l => l.id === link.id ? updated : l));
    }).catch(console.error);
  };
  const deleteLinkResource = (id: string) => {
    api.delete(`/resources/${id}`).then(() => setLinkResources(prev => prev.filter(l => l.id !== id))).catch(console.error);
  };

  const addParticipant = (p: Participant) => setParticipants(prev => [p, ...prev]);
  const removeParticipant = (id: string) => setParticipants(prev => prev.filter(p => p.id !== id));
  const updateParticipantStatus = (id: string, status: 'Registered' | 'Attended' | 'Cancelled') => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    const saved = localStorage.getItem('cv_participant_statuses');
    const localMap = saved ? JSON.parse(saved) : {};
    localMap[id] = status;
    localStorage.setItem('cv_participant_statuses', JSON.stringify(localMap));
  };

  const addTeamMember = (member: TeamMember) => {
    api.post('/team', member).then(res => setTeam(prev => [...prev, res.data.data])).catch(console.error);
  };
  const updateTeamMember = (member: TeamMember) => {
    api.put(`/team/${member.id}`, member).then(res => setTeam(prev => prev.map(m => m.id === member.id ? res.data.data : m))).catch(console.error);
  };
  const deleteTeamMember = (id: string) => {
    api.delete(`/team/${id}`).then(() => setTeam(prev => prev.filter(m => m.id !== id))).catch(console.error);
  };

  const addClubMember = (m: ClubMember) => setClubMembers(prev => [m, ...prev]);
  const removeClubMember = (id: string) => setClubMembers(prev => prev.filter(m => m.id !== id));

  const addAlum = (alum: Alum) => {
    api.post('/alumni', alum).then(res => setAlumni(prev => [res.data.data, ...prev])).catch(console.error);
  };
  const updateAlum = (alum: Alum) => {
    api.put(`/alumni/${alum.id}`, alum).then(res => setAlumni(prev => prev.map(a => a.id === alum.id ? res.data.data : a))).catch(console.error);
  };
  const deleteAlum = (id: string) => {
    api.delete(`/alumni/${id}`).then(() => setAlumni(prev => prev.filter(a => a.id !== id))).catch(console.error);
  };

  return (
    <GlobalContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      events, addEvent, updateEvent, deleteEvent,
      projects, addProject, deleteProject,
      team, addTeamMember, updateTeamMember, deleteTeamMember,
      blogs, achievements,
      managedBlogs, addManagedBlog, updateManagedBlog, deleteManagedBlog, toggleBlogStatus,
      managedAchievements, addManagedAchievement, updateManagedAchievement, deleteManagedAchievement,
      admins, addAdmin, deleteAdmin,
      videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
      linkResources, addLinkResource, updateLinkResource, deleteLinkResource,
      participants, addParticipant, removeParticipant, updateParticipantStatus,
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