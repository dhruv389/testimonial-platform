import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-base sm:text-lg">💬</span>
            </div>
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent tracking-tight">
              TestimonialHQ
            </span>
          </Link>
          
          {/* Navigation Links (Responsive padding & text sizing) */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link 
              to="/wall" 
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/wall')
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Wall
            </Link>

            <Link 
              to="/dashboard" 
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/dashboard')
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Dashboard
            </Link>

            <Link 
              to="/" 
              className={`ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 flex items-center space-x-1 ${
                isActive('/')
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <span>Submit</span>
              <span className="hidden sm:inline text-xs">✨</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;