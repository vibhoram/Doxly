import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/store';
import MergeTool from './tools/MergeTool';
import SplitTool from './tools/SplitTool';
import RotateTool from './tools/RotateTool';
import CompressTool from './tools/CompressTool';
import ConvertTool from './tools/ConvertTool';
import WatermarkTool from './tools/WatermarkTool';

export default function ToolPanel() {
  const { activeTool, setActiveTool } = useAppStore();

  const renderTool = () => {
    switch (activeTool) {
      case 'merge':
        return <MergeTool />;
      case 'split':
        return <SplitTool />;
      case 'rotate':
        return <RotateTool />;
      case 'compress':
        return <CompressTool />;
      case 'convert':
        return <ConvertTool />;
      case 'watermark':
        return <WatermarkTool />;
      default:
        return (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Select a tool to get started
          </div>
        );
    }
  };

  return (
    <motion.div
      className="h-full glass-strong"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
          <h3 className="font-semibold capitalize">{activeTool}</h3>
          <button
            onClick={() => setActiveTool(null)}
            className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin">
          {renderTool()}
        </div>
      </div>
    </motion.div>
  );
}
