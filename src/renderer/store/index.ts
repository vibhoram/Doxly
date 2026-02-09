import { create } from 'zustand';
import { PDFFile, Operation, AppSettings } from '@/types';

interface AppStore {
  // Files
  files: PDFFile[];
  addFiles: (files: PDFFile[]) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<PDFFile>) => void;
  toggleFileSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  getSelectedFiles: () => PDFFile[];
  clearFiles: () => void;

  // Operations
  operations: Operation[];
  addOperation: (operation: Operation) => void;
  updateOperation: (id: string, updates: Partial<Operation>) => void;
  removeOperation: (id: string) => void;
  clearOperations: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // UI State
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Files
  files: [],
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles]
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id)
    })),
  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f))
    })),
  toggleFileSelection: (id) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, selected: !f.selected } : f
      )
    })),
  clearSelection: () =>
    set((state) => ({
      files: state.files.map((f) => ({ ...f, selected: false }))
    })),
  selectAll: () =>
    set((state) => ({
      files: state.files.map((f) => ({ ...f, selected: true }))
    })),
  getSelectedFiles: () => get().files.filter((f) => f.selected),
  clearFiles: () => set({ files: [] }),

  // Operations
  operations: [],
  addOperation: (operation) =>
    set((state) => ({
      operations: [...state.operations, operation]
    })),
  updateOperation: (id, updates) =>
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === id ? { ...op, ...updates } : op
      )
    })),
  removeOperation: (id) =>
    set((state) => ({
      operations: state.operations.filter((op) => op.id !== id)
    })),
  clearOperations: () => set({ operations: [] }),

  // Settings
  settings: {
    theme: 'system',
    language: 'en',
    autoSave: true,
    recentFiles: []
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),

  // UI State
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
}));
