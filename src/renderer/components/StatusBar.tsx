import { useAppStore } from '@/store';
import { formatFileSize } from '@/utils/formatters';
import { Shield, Zap, Globe } from 'lucide-react';

export default function StatusBar() {
  const { files, operations } = useAppStore();
  // @ts-ignore
  const isElectron = !!window.electronAPI?.file;

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const activeOperations = operations.filter((op) => op.status === 'processing');

  return (
    <div className="h-10 flex items-center justify-between px-6 bg-white/50 dark:bg-black/40 backdrop-blur-3xl border-t border-gray-100 dark:border-white/[0.05] text-[10px] font-black uppercase tracking-[0.2em]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {files.length} Document(s) Loaded
        </div>
        {totalSize > 0 && (
          <div className="flex items-center gap-2 text-gray-500">
            <Zap className="w-3 h-3" />
            Forge Payload: {formatFileSize(totalSize)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-8 text-gray-400">
        {activeOperations.length > 0 && (
          <div className="flex items-center gap-2 text-primary">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Orchestrating {activeOperations.length} Operation(s)
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {isElectron ? (
            <div className="flex items-center gap-2 text-green-500">
              <Shield className="w-3 h-3" />
              Desktop Elite Mode
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-500">
              <Globe className="w-3 h-3" />
              Browser Stealth Mode
            </div>
          )}
        </div>

        <span className="opacity-50">
          NexForge v1.0.0-Elite
        </span>
      </div>
    </div>
  );
}
