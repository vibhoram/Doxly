import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/store';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import StatusBar from './components/StatusBar';

function App() {
  const { settings, updateSettings } = useAppStore();

  useEffect(() => {
    // Set initial theme
    const initTheme = async () => {
      if (settings.theme === 'system') {
        const systemTheme = await window.electronAPI.theme.getSystem();
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      } else {
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      }
    };

    initTheme();
  }, [settings.theme]);

  useEffect(() => {
    // Listen for progress updates
    window.electronAPI.onProgressUpdate((update) => {
      console.log('Progress update:', update);
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-light dark:bg-dark">
      <TitleBar onToggleTheme={toggleTheme} theme={settings.theme} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>

      <StatusBar />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass',
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(24px)'
          },
          duration: 3000
        }}
      />
    </div>
  );
}

export default App;
