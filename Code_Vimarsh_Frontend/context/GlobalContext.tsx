import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, EventType, ProjectType, TeamMember, BlogPost, ManagedBlog, ManagedAchievement, AchievementType, AdminUser, VideoResource, LinkResource, Participant, ClubMember, Alum } from '../types';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_TEAM, MOCK_BLOGS, MOCK_MANAGED_BLOGS, MOCK_MANAGED_ACHIEVEMENTS, MOCK_ACHIEVEMENTS, MOCK_VIDEOS, MOCK_LINKS, MOCK_ALUMNI } from '../constants';

const AUTH_KEY = 'cv_loggedin';

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  events: EventType[];
  addEvent: (event: EventType) => void;
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

const mergeById = <T extends { id: string }>(existing: T[], incoming: T[]) => {
  const merged = [...existing];

  incoming.forEach(item => {
    const index = merged.findIndex(current => current.id === item.id);
    if (index === -1) {
      merged.push(item);
      return;
    }

    merged[index] = item;
  });

  return merged;
};

// ── Seed data ────────────────────────────────────────────────────────────────
const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Aarya Shah', email: 'aarya@example.com', eventId: '1', eventTitle: 'Hackathon 2025', registeredAt: '2025-01-10' },
  { id: 'p2', name: 'Dev Mehta', email: 'dev@example.com', eventId: '1', eventTitle: 'Hackathon 2025', registeredAt: '2025-01-11' },
  { id: 'p3', name: 'Riya Patel', email: 'riya@example.com', eventId: '2', eventTitle: 'DSA Bootcamp', registeredAt: '2025-02-01' },
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

  const [events, setEvents] = useState<EventType[]>(MOCK_EVENTS);
  const [projects, setProjects] = useState<ProjectType[]>(MOCK_PROJECTS);
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [blogs, setBlogs] = useState<BlogPost[]>(MOCK_BLOGS);
  const [managedBlogs, setManagedBlogs] = useState<ManagedBlog[]>(MOCK_MANAGED_BLOGS);
  const [achievements, setAchievements] = useState<AchievementType[]>(MOCK_ACHIEVEMENTS);
  const [managedAchievements, setManagedAchievements] = useState<ManagedAchievement[]>(MOCK_MANAGED_ACHIEVEMENTS);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [videoResources, setVideoResources] = useState<VideoResource[]>(MOCK_VIDEOS);
  const [linkResources, setLinkResources] = useState<LinkResource[]>(MOCK_LINKS);
  const [participants, setParticipants] = useState<Participant[]>([]);
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
          // Map backend schema to frontend schema if necessary
          const mappedEvents = res.data.events.map((e: any) => ({
            ...e,
            id: e.id?.toString() || e._id || Math.random().toString(),
            date: e.date || e.startDate || new Date().toISOString(),
          }));
          setEvents(mappedEvents);
        }
      })
      .catch(err => console.error('Failed to fetch events:', err));

    // Fetch projects from backend
    api.get('/projects')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const mappedProjects = res.data.data.map((p: any) => ({
            ...p,
            id: p.id?.toString() || p._id || Math.random().toString(),
          }));
          setProjects(mappedProjects);
        }
      })
      .catch(err => console.error('Failed to fetch projects:', err));

    api.get('/team').then(res => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setTeam(prev => mergeById(prev, res.data.data));
      }
    }).catch(err => console.error('Failed to fetch team:', err));

    api.get('/alumni').then(res => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setAlumni(prev => mergeById(prev, res.data.data));
      }
    }).catch(err => console.error('Failed to fetch alumni:', err));

    api.get('/blogs').then(res => {
      if (res.data.success) setManagedBlogs(res.data.data);
    }).catch(err => console.error('Failed to fetch blogs:', err));

    api.get('/achievements').then(res => {
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setManagedAchievements(prev => mergeById(prev, res.data.data));
      }
    }).catch(err => console.error('Failed to fetch achievements:', err));

    api.get('/resources').then(res => {
      if (res.data.success) {
        const data = res.data.data;
        setVideoResources(data.filter((r: any) => r.category === 'youtube' || r.url.includes('youtube')));
        setLinkResources(data.filter((r: any) => r.category !== 'youtube' && !r.url.includes('youtube')));
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
          setParticipants(res.data.registrations.map((r: any) => ({
            id: r.id, name: r.full_name, email: r.email, eventId: r.event_id, eventTitle: r.event?.title || 'Unknown Event', registeredAt: new Date(r.registered_at).toISOString().split('T')[0]
          })));
        }
      }).catch(err => console.error('Failed to fetch registrations:', err));
    }
  }, [isLoggedIn]);

  const addEvent = (event: EventType) => setEvents(prev => [event, ...prev]);
  const addProject = (project: ProjectType) => setProjects(prev => [project, ...prev]);
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));
  const addAdmin = (admin: AdminUser) => setAdmins(prev => [admin, ...prev]);
  const deleteAdmin = (id: string) => {
    api.patch(`/admin/users/${id}/role`, { role: 'USER' })
      .then(res => {
        if (res.data.success) {
          setAdmins(prev => prev.filter(a => a.id !== id));
        }
      }).catch(console.error);
  };

  const addManagedBlog = (blog: ManagedBlog) => {
    api.post('/blogs', blog).then(res => setManagedBlogs(prev => [res.data.data, ...prev])).catch(console.error);
  };
  const updateManagedBlog = (blog: ManagedBlog) => {
    api.put(`/blogs/${blog.id}`, blog).then(res => setManagedBlogs(prev => prev.map(b => b.id === blog.id ? res.data.data : b))).catch(console.error);
  };
  const deleteManagedBlog = (id: string) => {
    api.delete(`/blogs/${id}`).then(() => setManagedBlogs(prev => prev.filter(b => b.id !== id))).catch(console.error);
  };
  const toggleBlogStatus = (id: string) => setManagedBlogs(prev => prev.map(b =>
    b.id === id ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published', updatedAt: new Date().toISOString() } : b
  ));

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
    api.post('/resources', { ...video, category: 'youtube' }).then(res => setVideoResources(prev => [res.data.data, ...prev])).catch(console.error);
  };
  const updateVideoResource = (video: VideoResource) => {
    api.put(`/resources/${video.id}`, { ...video, category: 'youtube' }).then(res => setVideoResources(prev => prev.map(v => v.id === video.id ? res.data.data : v))).catch(console.error);
  };
  const deleteVideoResource = (id: string) => {
    api.delete(`/resources/${id}`).then(() => setVideoResources(prev => prev.filter(v => v.id !== id))).catch(console.error);
  };

  const addLinkResource = (link: LinkResource) => {
    api.post('/resources', { ...link, category: 'website' }).then(res => setLinkResources(prev => [res.data.data, ...prev])).catch(console.error);
  };
  const updateLinkResource = (link: LinkResource) => {
    api.put(`/resources/${link.id}`, { ...link, category: 'website' }).then(res => setLinkResources(prev => prev.map(l => l.id === link.id ? res.data.data : l))).catch(console.error);
  };
  const deleteLinkResource = (id: string) => {
    api.delete(`/resources/${id}`).then(() => setLinkResources(prev => prev.filter(l => l.id !== id))).catch(console.error);
  };

  const addParticipant = (p: Participant) => setParticipants(prev => [p, ...prev]);
  const removeParticipant = (id: string) => setParticipants(prev => prev.filter(p => p.id !== id));

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
      events, addEvent,
      projects, addProject, deleteProject,
      team, addTeamMember, updateTeamMember, deleteTeamMember,
      blogs, achievements,
      managedBlogs, addManagedBlog, updateManagedBlog, deleteManagedBlog, toggleBlogStatus,
      managedAchievements, addManagedAchievement, updateManagedAchievement, deleteManagedAchievement,
      admins, addAdmin, deleteAdmin,
      videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
      linkResources, addLinkResource, updateLinkResource, deleteLinkResource,
      participants, addParticipant, removeParticipant,
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