import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import TerminalLoader from './components/TerminalLoader';
import IntroScreen from './components/IntroScreen';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy loading pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const Resources = React.lazy(() => import('./pages/Resources'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Team = React.lazy(() => import('./pages/Team'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const Alumni = React.lazy(() => import('./pages/Alumni'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));

// Fallback loader while lazy components load
const PageLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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

  // Do not wrap the Admin panel in standard Layout to allow for a full-screen dashboard feel
  const isAdminRoute = location.pathname.startsWith('/admin');

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
              </Routes>
            </React.Suspense>
          ) : (
            <Layout>
              <React.Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/alumni" element={<Alumni />} />
                  <Route path="/contact" element={<Contact />} />
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