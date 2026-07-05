import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, Cpu, Github, ExternalLink } from 'lucide-react';
import { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onAddToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function Navbar({ theme, setTheme, onAddToast }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    onAddToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
  };

  const navItems = [
    { name: 'Journey', path: '/' },
    { name: 'Concepts', path: '/concepts' },
    { name: 'Prices', path: '/prices' },
    { name: 'Simulator', path: '/simulator' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            id="nav-logo"
            to="/" 
            className="flex items-center gap-2.5 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-emerald-400 p-[1.5px] shadow-md shadow-cyan-500/10 group-hover:shadow-cyan-500/30 transition-all duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent tracking-tight">
              ChainNova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Desktop Navigation">
            {navItems.map((item) => (
              <NavLink
                id={`nav-item-${item.name.toLowerCase()}`}
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-purple-600 dark:text-cyan-400 bg-purple-500/10 dark:bg-cyan-400/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/30'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="theme-toggle-desktop"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer"
              aria-label="Toggle visual theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
            
            <a
              id="nav-github-desktop"
              href="https://github.com"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          {/* Mobile Hamburguer / Theme switches */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="theme-toggle-mobile"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer"
              aria-label="Toggle main menu"
            >
              {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-slate-200/40 dark:border-slate-800/40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2 flex flex-col">
              {navItems.map((item) => (
                <NavLink
                  id={`nav-item-mobile-${item.name.toLowerCase()}`}
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-purple-600 dark:text-cyan-400 bg-purple-500/10 dark:bg-cyan-400/10'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
                <a
                  id="nav-github-mobile"
                  href="https://github.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
