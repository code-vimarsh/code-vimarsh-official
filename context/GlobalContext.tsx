import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventType, ProjectType, TeamMember, BlogPost, AchievementType, AdminUser } from '../types';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_TEAM, MOCK_BLOGS, MOCK_ACHIEVEMENTS } from '../constants';

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

  const addEvent = (event: EventType) => setEvents(prev => [event, ...prev]);
  const addProject = (project: ProjectType) => setProjects(prev => [project, ...prev]);
  const addAdmin = (admin: AdminUser) => setAdmins(prev => [admin, ...prev]);

  return (
    <GlobalContext.Provider value={{
      events, addEvent,
      projects, addProject,
      team, blogs, achievements,
      admins, addAdmin
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