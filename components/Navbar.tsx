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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-bgDark/80 backdrop-blur-md border-b border-surfaceLight py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <Terminal className="text-primary group-hover:text-secondary transition-colors" size={24} />
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
            _Code<span className="text-primary">Vimarsh</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'text-primary bg-primary/10' 
                  : 'text-textMuted hover:text-white hover:bg-surfaceLight'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/admin" className="text-textMuted hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10" title="Admin Panel">
            <Settings size={18} />
          </Link>
          <div className="h-6 w-px bg-surfaceLight mx-1"></div>
          <button className="text-textMuted hover:text-white transition-colors p-2 rounded-full hover:bg-surfaceLight">
            <Search size={18} />
          </button>
          <Link to="/dashboard" className="flex items-center space-x-2 bg-surface border border-surfaceLight hover:border-primary/50 transition-all px-4 py-2 rounded-lg group">
            <User size={16} className="text-textMuted group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Lvl 12</span>
          </Link>
          <button className="bg-primary hover:bg-secondary text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(255,106,0,0.3)] hover:shadow-[0_0_25px_rgba(255,106,0,0.5)]">
            Join Club
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
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
                className={`px-4 py-3 rounded-md text-base font-medium ${
                  location.pathname === item.path 
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