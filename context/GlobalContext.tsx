import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventType, ProjectType, TeamMember, BlogPost, ManagedBlog, ManagedAchievement, AchievementType, AdminUser, VideoResource, LinkResource, Participant, ClubMember } from '../types';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_TEAM, MOCK_BLOGS, MOCK_MANAGED_BLOGS, MOCK_MANAGED_ACHIEVEMENTS, MOCK_ACHIEVEMENTS, MOCK_VIDEOS, MOCK_LINKS } from '../constants';

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
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

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
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );

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
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'Aarav Patel', email: 'aarav@vimarsh.dev', role: 'Super Admin', addedAt: '2023-08-10' },
    { id: '2', name: 'System Core', email: 'root@vimarsh.dev', role: 'Super Admin', addedAt: '2023-01-01' }
  ]);
  const [videoResources, setVideoResources] = useState<VideoResource[]>(MOCK_VIDEOS);
  const [linkResources, setLinkResources] = useState<LinkResource[]>(MOCK_LINKS);
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>(MOCK_MEMBERS);

  const addEvent = (event: EventType) => setEvents(prev => [event, ...prev]);
  const addProject = (project: ProjectType) => setProjects(prev => [project, ...prev]);
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));
  const addAdmin = (admin: AdminUser) => setAdmins(prev => [admin, ...prev]);
  const deleteAdmin = (id: string) => setAdmins(prev => prev.filter(a => a.id !== id));

  const addManagedBlog = (blog: ManagedBlog) => setManagedBlogs(prev => [blog, ...prev]);
  const updateManagedBlog = (blog: ManagedBlog) => setManagedBlogs(prev => prev.map(b => b.id === blog.id ? blog : b));
  const deleteManagedBlog = (id: string) => setManagedBlogs(prev => prev.filter(b => b.id !== id));
  const toggleBlogStatus = (id: string) => setManagedBlogs(prev => prev.map(b =>
    b.id === id ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published', updatedAt: new Date().toISOString() } : b
  ));

  const addManagedAchievement = (a: ManagedAchievement) => setManagedAchievements(prev => [...prev, a].sort((x, y) => x.order - y.order));
  const updateManagedAchievement = (a: ManagedAchievement) => setManagedAchievements(prev => prev.map(x => x.id === a.id ? a : x).sort((x, y) => x.order - y.order));
  const deleteManagedAchievement = (id: string) => setManagedAchievements(prev => prev.filter(x => x.id !== id));

  const addVideoResource = (video: VideoResource) => setVideoResources(prev => [video, ...prev]);
  const updateVideoResource = (video: VideoResource) => setVideoResources(prev => prev.map(v => v.id === video.id ? video : v));
  const deleteVideoResource = (id: string) => setVideoResources(prev => prev.filter(v => v.id !== id));

  const addLinkResource = (link: LinkResource) => setLinkResources(prev => [link, ...prev]);
  const updateLinkResource = (link: LinkResource) => setLinkResources(prev => prev.map(l => l.id === link.id ? link : l));
  const deleteLinkResource = (id: string) => setLinkResources(prev => prev.filter(l => l.id !== id));

  const addParticipant = (p: Participant) => setParticipants(prev => [p, ...prev]);
  const removeParticipant = (id: string) => setParticipants(prev => prev.filter(p => p.id !== id));

  const addTeamMember = (member: TeamMember) => setTeam(prev => [...prev, member]);
  const updateTeamMember = (member: TeamMember) => setTeam(prev => prev.map(m => m.id === member.id ? member : m));
  const deleteTeamMember = (id: string) => setTeam(prev => prev.filter(m => m.id !== id));

  const addClubMember = (m: ClubMember) => setClubMembers(prev => [m, ...prev]);
  const removeClubMember = (id: string) => setClubMembers(prev => prev.filter(m => m.id !== id));

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