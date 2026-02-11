/// <reference types="vite/client" />

interface FileInfo {
  path: string;
  name: string;
  size: number;
  extension: string;
}

interface ProgressUpdate {
  progress: number;
  message: string;
}

interface Window {
  electronAPI?: {
    window: {
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
    };
    file: {
      select: (options?: { multiple?: boolean; filters?: any[] }) => Promise<FileInfo[] | null>;
      save: (options: { defaultPath?: string; filters?: any[] }) => Promise<string | null>;
      read: (filePath: string) => Promise<Uint8Array | Buffer>;
      write: (filePath: string, data: Uint8Array | Buffer) => Promise<boolean>;
      delete: (filePath: string) => Promise<boolean>;
      openInExplorer: (filePath: string) => Promise<void>;
    };
    convert: {
      officeToPdf: (filePath: string, outputPath: string) => Promise<boolean>;
      pdfToOffice: (filePath: string, outputPath: string, format: string) => Promise<boolean>;
    };
    theme: {
      getSystem: () => Promise<'light' | 'dark'>;
    };
    onProgressUpdate: (callback: (update: ProgressUpdate) => void) => void;
  };
}
