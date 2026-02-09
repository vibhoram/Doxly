import { contextBridge, ipcRenderer } from 'electron';

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  extension: string;
}

export interface ProgressUpdate {
  progress: number;
  message: string;
}

const api = {
  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:is-maximized')
  },

  // File operations
  file: {
    select: (options?: { multiple?: boolean; filters?: any[] }) =>
      ipcRenderer.invoke('file:select', options) as Promise<FileInfo[] | null>,
    save: (options: { defaultPath?: string; filters?: any[] }) =>
      ipcRenderer.invoke('file:save', options) as Promise<string | null>,
    read: (filePath: string) =>
      ipcRenderer.invoke('file:read', filePath) as Promise<Buffer>,
    write: (filePath: string, data: Buffer | Uint8Array) =>
      ipcRenderer.invoke('file:write', filePath, data) as Promise<boolean>,
    delete: (filePath: string) =>
      ipcRenderer.invoke('file:delete', filePath) as Promise<boolean>,
    openInExplorer: (filePath: string) =>
      ipcRenderer.invoke('file:open-in-explorer', filePath)
  },

  // Conversion operations
  convert: {
    officeToPdf: (filePath: string, outputPath: string) =>
      ipcRenderer.invoke('convert:office-to-pdf', filePath, outputPath) as Promise<boolean>,
    pdfToOffice: (filePath: string, outputPath: string, format: string) =>
      ipcRenderer.invoke('convert:pdf-to-office', filePath, outputPath, format) as Promise<boolean>
  },

  // Theme
  theme: {
    getSystem: () => ipcRenderer.invoke('theme:get-system') as Promise<string>
  },

  // Progress updates
  onProgressUpdate: (callback: (update: ProgressUpdate) => void) => {
    ipcRenderer.on('progress:update', (_event, update) => callback(update));
  }
};

contextBridge.exposeInMainWorld('electronAPI', api);

export type ElectronAPI = typeof api;
