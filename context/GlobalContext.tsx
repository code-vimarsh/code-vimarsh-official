import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventType, ProjectType, TeamMember, BlogPost, AchievementType, AdminUser, VideoResource, LinkResource } from '../types';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_TEAM, MOCK_BLOGS, MOCK_ACHIEVEMENTS, MOCK_VIDEOS, MOCK_LINKS } from '../constants';

interface GlobalContextType {
  events: EventType[];
  addEvent: (event: EventType) => void;
  projects: ProjectType[];
  addProject: (project: ProjectType) => void;
  team: TeamMember[];
  blogs: BlogPost[];
  achievements: AchievementType[];
  admins: AdminUser[];
  addAdmin: (admin: AdminUser) => void;
  videoResources: VideoResource[];
  addVideoResource: (video: VideoResource) => void;
  updateVideoResource: (video: VideoResource) => void;
  deleteVideoResource: (id: string) => void;
  linkResources: LinkResource[];
  addLinkResource: (link: LinkResource) => void;
  updateLinkResource: (link: LinkResource) => void;
  deleteLinkResource: (id: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventType[]>(MOCK_EVENTS);
  const [projects, setProjects] = useState<ProjectType[]>(MOCK_PROJECTS);
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [blogs, setBlogs] = useState<BlogPost[]>(MOCK_BLOGS);
  const [achievements, setAchievements] = useState<AchievementType[]>(MOCK_ACHIEVEMENTS);
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'Aarav Patel', email: 'aarav@vimarsh.dev', role: 'Super Admin', addedAt: '2023-08-10' },
    { id: '2', name: 'System Core', email: 'root@vimarsh.dev', role: 'Super Admin', addedAt: '2023-01-01' }
  ]);
  const [videoResources, setVideoResources] = useState<VideoResource[]>(MOCK_VIDEOS);
  const [linkResources, setLinkResources] = useState<LinkResource[]>(MOCK_LINKS);

  const addEvent = (event: EventType) => setEvents(prev => [event, ...prev]);
  const addProject = (project: ProjectType) => setProjects(prev => [project, ...prev]);
  const addAdmin = (admin: AdminUser) => setAdmins(prev => [admin, ...prev]);

  const addVideoResource = (video: VideoResource) => setVideoResources(prev => [video, ...prev]);
  const updateVideoResource = (video: VideoResource) => setVideoResources(prev => prev.map(v => v.id === video.id ? video : v));
  const deleteVideoResource = (id: string) => setVideoResources(prev => prev.filter(v => v.id !== id));

  const addLinkResource = (link: LinkResource) => setLinkResources(prev => [link, ...prev]);
  const updateLinkResource = (link: LinkResource) => setLinkResources(prev => prev.map(l => l.id === link.id ? link : l));
  const deleteLinkResource = (id: string) => setLinkResources(prev => prev.filter(l => l.id !== id));

  return (
    <GlobalContext.Provider value={{
      events, addEvent,
      projects, addProject,
      team, blogs, achievements,
      admins, addAdmin,
      videoResources, addVideoResource, updateVideoResource, deleteVideoResource,
      linkResources, addLinkResource, updateLinkResource, deleteLinkResource
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