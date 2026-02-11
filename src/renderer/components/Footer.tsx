import { Mail, ExternalLink, Heart, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer 
      className="bg-white/50 dark:bg-black/20 backdrop-blur-3xl border-t border-gray-100 dark:border-white/[0.05] transition-colors duration-200 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent italic">
                Doxly
              </h3>
            </div>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              Elite offline document orchestration. Forged with precision, powered by privacy.
            </p>
            <div className="flex items-center gap-3 text-sm text-primary font-bold hover:text-primary/80 transition-all cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail size={16} />
              </div>
              <a href="mailto:support@nexailabs.tech" className="tracking-widest uppercase">support@nexailabs.tech</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-1">Ecosystem</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-300">
              <li><Link to="/features" className="hover:text-primary transition-all px-1">All Elite Tools</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-all px-1">The Forge Tech</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-all px-1">Enterprise Access</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-1">Nexai Labs</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-300">
              <li><Link to="/about" className="hover:text-primary transition-all px-1">Mission Log</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-all px-1">Connect</Link></li>
              <li>
                <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-all px-1 uppercase tracking-tighter">
                  Laboratories <ExternalLink size={12} className="opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-1">Compliance</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-300">
              <li><Link to="/terms" className="hover:text-primary transition-all px-1">Usage Covenant</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-all px-1">Privacy Protocols</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-primary transition-all px-1">Trace Policy</Link></li>
              <li><Link to="/copyright" className="hover:text-primary transition-all px-1">Ironclad IP</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-12 border-t border-gray-100 dark:border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>© {new Date().getFullYear()} Doxly</span>
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
              Made with <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> by Vibhor
            </span>
          </div>
          <div className="flex gap-8">
            <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-primary uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all">nexailabs.tech</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
