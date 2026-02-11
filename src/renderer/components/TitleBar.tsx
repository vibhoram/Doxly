import { Minus, Square, X, Moon, Sun } from 'lucide-react';

interface TitleBarProps {
  onToggleTheme: () => void;
  theme: string;
}

export default function TitleBar({ onToggleTheme, theme }: TitleBarProps) {
  const handleMinimize = () => {
    window.electronAPI.window.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI.window.maximize();
  };

  const handleClose = () => {
    window.electronAPI.window.close();
  };

  return (
    <div className="h-12 flex items-center justify-between px-4 glass border-b border-light-border dark:border-dark-border select-none">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
          Doxly
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          v1.0.0
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleMinimize}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            title="Maximize"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
