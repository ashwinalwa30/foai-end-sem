import React from 'react';
import { Sun, Moon, Rocket, Menu } from 'lucide-react';
import useStore from '../../store/useStore';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useStore();

  return (
    <nav className={`sticky top-0 z-50 w-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              ISS Orbit
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'}`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
