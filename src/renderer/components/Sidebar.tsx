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
  Sparkles
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
  const { activeTool, setActiveTool, sidebarCollapsed } = useAppStore();

  return (
    <motion.div
      className="w-64 glass border-r border-light-border dark:border-dark-border p-4 overflow-y-auto scrollbar-thin"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">PDF Tools</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.type;

            return (
              <motion.button
                key={tool.type}
                onClick={() => setActiveTool(isActive ? null : tool.type)}
                className={`sidebar-btn ${
                  isActive ? 'glass-strong ring-2 ring-primary' : ''
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tool.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setActiveTool('settings')}
          className="sidebar-btn w-full"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>

      <div className="mt-8 p-4 glass-strong rounded-lg">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Unlimited file size</span>
          </div>
          <div className="text-[10px] opacity-70">
            All processing happens locally on your device. Your files never leave your computer.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
