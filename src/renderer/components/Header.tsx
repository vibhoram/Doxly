import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Layout } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`
          relative px-2 py-1 text-sm font-bold tracking-wider uppercase transition-all
          ${isActive 
            ? 'text-primary' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }
        `}
        onClick={() => setIsMenuOpen(false)}
      >
        {children}
        {isActive && (
          <motion.div 
            layoutId="nav-underline"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
          />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-[60] w-full bg-white/70 dark:bg-black/40 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/[0.05] transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
              <Layout className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight leading-none dark:text-white">
                Doxly
              </span>
              <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-70">
                Documents
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/features">Tools</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            
            <a 
              href="https://nexailabs.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Visit Nexai Labs
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/[0.05] text-gray-900 dark:text-white transition-all"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                    <X size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                    <Menu size={20} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 border-b border-gray-200/50 dark:border-white/[0.05] bg-white dark:bg-gray-900 backdrop-blur-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6 flex flex-col items-center">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/features">Tools</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <a 
                href="https://nexailabs.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full max-w-[240px] px-6 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl text-center"
              >
                Visit Nexai Labs
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
