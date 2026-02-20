import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Search, User, Menu, X, Settings } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show standard navbar on admin pages for deeper immersion
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-bgDark/95 backdrop-blur-xl shadow-[0_1px_30px_rgba(0,0,0,0.6)]'
        : 'bg-transparent backdrop-blur-sm'
        }`}
      style={{ height: '56px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <Terminal className="text-primary group-hover:text-secondary transition-colors flex-shrink-0" size={22} />
          <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors whitespace-nowrap">
            _Code<span className="text-primary">Vimarsh</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 xl:gap-1 flex-shrink min-w-0">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-2 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${location.pathname === item.path
                ? 'text-primary bg-primary/10'
                : 'text-textMuted hover:text-white hover:bg-surfaceLight'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <Link
            to="/admin"
            className="text-textMuted hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary/10 flex-shrink-0"
            title="Admin Panel"
          >
            <Settings size={16} />
          </Link>
          <div className="h-5 w-px bg-surfaceLight flex-shrink-0"></div>
          <button className="text-textMuted hover:text-white transition-colors p-1.5 rounded-full hover:bg-surfaceLight flex-shrink-0">
            <Search size={16} />
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 bg-surface border border-surfaceLight hover:border-primary/50 transition-all px-2.5 py-1.5 rounded-lg group whitespace-nowrap flex-shrink-0"
          >
            <User size={13} className="text-textMuted group-hover:text-primary transition-colors flex-shrink-0" />
            <span className="text-xs font-medium leading-none">Lvl 12</span>
          </Link>
          <button className="bg-primary hover:bg-secondary text-black font-semibold px-3 py-1.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(255,106,0,0.3)] hover:shadow-[0_0_25px_rgba(255,106,0,0.5)] whitespace-nowrap flex-shrink-0">
            Join Club
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-1">
          <Link to="/admin" className="text-textMuted p-2 hover:text-primary">
            <Settings size={20} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-textMuted hover:text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-surfaceLight py-4 px-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-md text-base font-medium ${location.pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-white hover:bg-surfaceLight'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-surfaceLight flex flex-col space-y-3">
              <button className="bg-primary text-black font-semibold px-4 py-3 rounded-lg w-full text-center">
                Join Club
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;