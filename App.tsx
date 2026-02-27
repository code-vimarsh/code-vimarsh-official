import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import TerminalLoader from './components/TerminalLoader';
import IntroScreen from './components/IntroScreen';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy loading pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const EventDetails = React.lazy(() => import('./pages/EventDetails'));
const Resources = React.lazy(() => import('./pages/Resources'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Team = React.lazy(() => import('./pages/Team'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const Alumni = React.lazy(() => import('./pages/Alumni'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));
const AdminFormBuilder = React.lazy(() => import('./pages/AdminFormBuilder'));

// Auth pages – rendered without the intro/loader state machine
const SignUp = React.lazy(() => import('./pages/SignUp'));
const SignIn = React.lazy(() => import('./pages/SignIn'));

// Fallback loader while lazy components load
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-mono text-textMuted tracking-widest uppercase">Loading</span>
    </div>
  </div>
);

const App: React.FC = () => {
  // State machine controlling the immersive flow
  const [appState, setAppState] = useState<'intro' | 'booting' | 'ready'>('intro');
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Routes that should bypass the immersive intro/loader entirely
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute  = location.pathname === '/signup' || location.pathname === '/signin';

  // ── Auth pages rendered standalone (no Layout, no intro) ──────────────────
  if (isAuthRoute) {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </AnimatePresence>
      </React.Suspense>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* Phase 1: Fire Animation Intro */}
      {appState === 'intro' && (
        <IntroScreen key="intro" onExplore={() => setAppState('booting')} />
      )}

      {/* Phase 2: Terminal Loading System */}
      {appState === 'booting' && (
        <TerminalLoader key="loader" onComplete={() => setAppState('ready')} />
      )}

      {/* Phase 3: The Main Application Ecosystem */}
      {appState === 'ready' && (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full min-h-screen flex flex-col"
        >
          {isAdminRoute ? (
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/forms" element={<AdminFormBuilder />} />
                <Route path="/admin/forms/:eventId" element={<AdminFormBuilder />} />
              </Routes>
            </React.Suspense>
          ) : (
            <Layout>
              <React.Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/alumni" element={<Alumni />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* Fallback redirects so typed URLs also work from main flow */}
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                </Routes>
              </React.Suspense>
            </Layout>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;