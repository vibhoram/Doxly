import type { ElectronAPI } from '../main/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export interface PDFFile {
  id: string;
  name: string;
  path: string;
  size: number;
  pages?: number;
  thumbnail?: string;
  selected: boolean;
  created: Date;
  data?: ArrayBuffer; // Support for browser-mode data persistence
}

export interface Operation {
  id: string;
  type: 'merge' | 'split' | 'compress' | 'convert' | 'rotate' | 'extract' | 'watermark' | 'protect';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  files: string[]; // file ids
  createdAt: Date;
  completedAt?: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en';
  autoSave: boolean;
  recentFiles: string[];
  defaultOutputPath?: string;
}

export type ToolType =
  | 'merge'
  | 'split'
  | 'compress'
  | 'convert'
  | 'rotate'
  | 'crop'
  | 'extract'
  | 'text'
  | 'watermark'  | 'protect'
  | 'grayscale'
  | 'headers'
  | 'optimize';
