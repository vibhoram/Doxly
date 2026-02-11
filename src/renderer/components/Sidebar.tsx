import { motion } from 'framer-motion';
import {
  Combine,
  Split,
  RotateCw,
  Minimize2,
  FileText,
  Image,
  Droplet,
  Lock,
  Scissors,
  Type,
  Settings,
  Sparkles,
  Layout
} from 'lucide-react';
import { useAppStore } from '@/store';
import type { ToolType } from '@/types';

const tools: Array<{ icon: any; label: string; type: ToolType }> = [
  { icon: Combine, label: 'Merge', type: 'merge' },
  { icon: Split, label: 'Split', type: 'split' },
  { icon: RotateCw, label: 'Rotate', type: 'rotate' },
  { icon: Minimize2, label: 'Compress', type: 'compress' },
  { icon: FileText, label: 'Convert', type: 'convert' },
  { icon: Scissors, label: 'Extract', type: 'extract' },
  { icon: Type, label: 'Add Text', type: 'text' },
  { icon: Droplet, label: 'Watermark', type: 'watermark' },
  { icon: Lock, label: 'Protect', type: 'protect' },
  { icon: Image, label: 'Grayscale', type: 'grayscale' },
  { icon: Sparkles, label: 'Optimize', type: 'optimize' }
];

export default function Sidebar() {
  const { activeTool, setActiveTool } = useAppStore();

  return (
    <motion.div
      className="w-72 bg-white/40 dark:bg-black/10 backdrop-blur-3xl border-r border-gray-200 dark:border-white/[0.05] p-6 overflow-y-auto scrollbar-thin"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            PDF Suite
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.type;

            return (
              <motion.button
                key={tool.type}
                onClick={() => setActiveTool(isActive ? null : tool.type)}
                className={`
                  relative group flex flex-col items-center justify-center p-4 rounded-[1.25rem] transition-all duration-300
                  ${isActive 
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-1 ring-primary pointer-events-none' 
                    : 'bg-white/50 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/[0.05]'
                  }
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon className={`w-7 h-7 mb-2 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                <span className="text-[11px] font-bold tracking-wide uppercase">{tool.label}</span>
                
                {/* Active Tool Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 blur-[15px] -z-10 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <motion.button
          onClick={() => setActiveTool('settings')}
          whileHover={{ x: 4 }}
          className={`
            w-full flex items-center gap-3 p-4 rounded-2xl transition-all
            ${activeTool === 'settings'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-100 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.08]'
            }
          `}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
        </motion.button>

        <div className="p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest italic">Nitro Pack</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            All heavy-duty document tasks are performed locally. 
            <strong> 100% Privacy Guaranteed.</strong>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
