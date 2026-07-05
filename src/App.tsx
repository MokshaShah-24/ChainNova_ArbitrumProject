import { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

import { Theme } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import ToastContainer, { ToastMessage } from './components/Toast';

// Pages
import Home from './pages/Home';
import Concepts from './pages/Concepts';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';

// Page layout transitions
function PageWrapper({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

// Scroll restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('chainnova-theme');
    return (saved as Theme) || 'dark'; // Startup theme - premium dark default
  });

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Scroll visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync theme with HTML document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chainnova-theme', theme);
  }, [theme]);

  // Track scroll activity
  useEffect(() => {
    const handleScroll = () => {
      // Back to top button visibility
      setShowBackToTop(window.scrollY > 400);

      // Scroll progress percentage calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100 transition-colors duration-300">
        
        {/* Progress Bar */}
        <div 
          id="scroll-progress-bar"
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-400 to-emerald-400 z-50 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Floating Particles and Gradient Grid Backdrop */}
        <AnimatedBackground theme={theme} />

        {/* Global sticky navigation bar */}
        <Navbar theme={theme} setTheme={setTheme} onAddToast={addToast} />

        {/* Multi-page container */}
        <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-4">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/concepts" element={<PageWrapper><Concepts /></PageWrapper>} />
            <Route path="/prices" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/simulator" element={<PageWrapper><Simulator /></PageWrapper>} />
            <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
          </Routes>
        </main>

        {/* Global Footer assignment layout */}
        <Footer />

        {/* Floating Back to Top control */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              id="back-to-top-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 left-6 z-40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-cyan-400 shadow-lg cursor-pointer transition-all"
              aria-label="Scroll back to top of the page"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Active Toasts notification board */}
        <ToastContainer toasts={toasts} onClose={removeToast} />

      </div>
    </BrowserRouter>
  );
}
