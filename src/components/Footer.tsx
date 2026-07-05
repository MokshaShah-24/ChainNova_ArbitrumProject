import { Link } from 'react-router-dom';
import { Cpu, Github, ExternalLink, Heart, Globe, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200/40 dark:border-slate-800/40 bg-white/45 dark:bg-[#0F172A]/45 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px]">
                <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                ChainNova
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
              Explore the Future of Blockchain, One Block at a Time. A premium interactive learning canvas demystifying Web3, Rollup Architecture, and Cryptographic Mining.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-500 font-semibold">
              <Shield className="w-4.5 h-4.5 text-emerald-500" />
              <span>Secured with Client-Side Cryptography (SHA-256)</span>
            </div>
          </div>

          {/* Quick Explanations */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">
                  Arbitrum L2 Journey
                </Link>
              </li>
              <li>
                <Link to="/concepts" className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">
                  Concept Explorer
                </Link>
              </li>
              <li>
                <Link to="/prices" className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">
                  Real-time Dashboard
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors">
                  Interactive Block Mining
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer / Student Metadata Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Developer Info
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Globe className="w-4 h-4 text-purple-500" />
                <span>Moksha</span>
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/60 p-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">Class Assignment</span>
                Web3 Pioneer Batch of 2026
              </div>
              <a
                id="footer-github"
                href="https://github.com"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Source Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            &copy; {currentYear} ChainNova. Built for premium visual learning.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-semibold">
            Made with <Heart className="w-3 h-3 text-rose-500 animate-pulse" /> for the Ethereum and Arbitrum communities
          </p>
        </div>
      </div>
    </footer>
  );
}
