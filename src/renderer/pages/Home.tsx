import { useRef } from 'react';
import { useAppStore } from '@/store';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import StatusBar from './components/StatusBar';

// New Home Component to enable routing
export default function Home() {
  return (
    <>
      {/* Sidebar could be conditionally rendered or just part of MainContent layout */}
      {/* For now, just render MainContent as it contains the tools */}
      {/* Wait, the original App.tsx layout had Sidebar and MainContent side-by-side? */}
      {/* Looking at App.tsx, they were not side-by-side in flex-row explicitly in the snippet I saw. */}
      {/* Let's double check App.tsx layout. It was flexible column on mobile? */}
      <MainContent />
      <StatusBar />
    </>
  );
}
