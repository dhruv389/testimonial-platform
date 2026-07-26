import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2 shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-base sm:text-lg">💬</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent tracking-tight">
              TestimonialHQ
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center space-x-2">
            <Link 
              to="/wall" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive('/wall')
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Wall of Love
            </Link>

            <Link 
              to="/dashboard" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive('/dashboard')
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Dashboard
            </Link>

            <Link 
              to="/" 
              className={`ml-2 px-4 py-2 rounded-lg text-sm font-bold shadow-xs transition-all duration-150 flex items-center space-x-1.5 ${
                isActive('/')
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <span>Submit Feedback</span>
              <span className="text-xs">✨</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Menu Toggle Button */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2 shadow-lg transition-all">
          <Link
            to="/wall"
            onClick={closeMobileMenu}
            className={`block px-4 py-3 rounded-xl text-sm font-bold transition ${
              isActive('/wall')
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            ⭐ Wall of Love
          </Link>

          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className={`block px-4 py-3 rounded-xl text-sm font-bold transition ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            🛡️ Moderation Dashboard
          </Link>

          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`block px-4 py-3 rounded-xl text-sm font-bold text-center transition ${
              isActive('/')
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            ✍️ Submit Feedback ✨
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;