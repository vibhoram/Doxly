import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    frame: false,
    backgroundColor: '#0a0a0a',
    show: false,
    titleBarStyle: 'hidden'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Auto-updater events
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Window controls
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('window:is-maximized', () => {
  return mainWindow?.isMaximized();
});

// File system operations
ipcMain.handle('file:select', async (_event, options?: { multiple?: boolean; filters?: any[] }) => {
  const result = await dialog.showOpenDialog({
    properties: options?.multiple ? ['openFile', 'multiSelections'] : ['openFile'],
    filters: options?.filters || [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'Office Files', extensions: ['docx', 'xlsx', 'pptx'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) {
    return null;
  }

  const files = await Promise.all(
    result.filePaths.map(async (filePath) => {
      const stats = await fs.stat(filePath);
      return {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size,
        extension: path.extname(filePath).toLowerCase()
      };
    })
  );

  return files;
});

ipcMain.handle('file:save', async (_event, options: { defaultPath?: string; filters?: any[] }) => {
  const result = await dialog.showSaveDialog({
    defaultPath: options.defaultPath,
    filters: options.filters || [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  return result.filePath;
});

ipcMain.handle('file:read', async (_event, filePath: string) => {
  try {
    const buffer = await fs.readFile(filePath);
    return buffer;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

ipcMain.handle('file:write', async (_event, filePath: string, data: Buffer | Uint8Array) => {
  try {
    await fs.writeFile(filePath, data);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

ipcMain.handle('file:delete', async (_event, filePath: string) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
});

ipcMain.handle('file:open-in-explorer', async (_event, filePath: string) => {
  shell.showItemInFolder(filePath);
});

// LibreOffice conversion
ipcMain.handle('convert:office-to-pdf', async (_event, filePath: string, outputPath: string) => {
  try {
    // Check if LibreOffice is installed
    const libreOfficePaths = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
      '/Applications/LibreOffice.app/Contents/MacOS/soffice',
      '/usr/bin/soffice'
    ];

    let libreOfficePath = '';
    for (const path of libreOfficePaths) {
      try {
        await fs.access(path);
        libreOfficePath = path;
        break;
      } catch {
        continue;
      }
    }

    if (!libreOfficePath) {
      throw new Error('LibreOffice not found. Please install LibreOffice to use conversion features.');
    }

    const outputDir = path.dirname(outputPath);
    const command = `"${libreOfficePath}" --headless --convert-to pdf --outdir "${outputDir}" "${filePath}"`;

    await execAsync(command);

    // The converted file will have the same name but .pdf extension
    const baseName = path.basename(filePath, path.extname(filePath));
    const convertedPath = path.join(outputDir, `${baseName}.pdf`);

    // Rename if needed
    if (convertedPath !== outputPath) {
      await fs.rename(convertedPath, outputPath);
    }

    return true;
  } catch (error) {
    console.error('Office to PDF conversion error:', error);
    throw error;
  }
});

ipcMain.handle('convert:pdf-to-office', async (_event, filePath: string, outputPath: string, format: string) => {
  try {
    const libreOfficePaths = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
      '/Applications/LibreOffice.app/Contents/MacOS/soffice',
      '/usr/bin/soffice'
    ];

    let libreOfficePath = '';
    for (const path of libreOfficePaths) {
      try {
        await fs.access(path);
        libreOfficePath = path;
        break;
      } catch {
        continue;
      }
    }

    if (!libreOfficePath) {
      throw new Error('LibreOffice not found. Please install LibreOffice to use conversion features.');
    }

    const outputDir = path.dirname(outputPath);
    const formatMap: Record<string, string> = {
      docx: 'docx',
      xlsx: 'xlsx',
      pptx: 'pptx'
    };

    const convertFormat = formatMap[format] || format;
    const command = `"${libreOfficePath}" --headless --convert-to ${convertFormat} --outdir "${outputDir}" "${filePath}"`;

    await execAsync(command);

    const baseName = path.basename(filePath, path.extname(filePath));
    const convertedPath = path.join(outputDir, `${baseName}.${format}`);

    if (convertedPath !== outputPath) {
      await fs.rename(convertedPath, outputPath);
    }

    return true;
  } catch (error) {
    console.error('PDF to Office conversion error:', error);
    throw error;
  }
});

// Theme
ipcMain.handle('theme:get-system', () => {
  return 'dark'; // You can use nativeTheme.shouldUseDarkColors for actual system theme
});

// Progress updates
export function sendProgressUpdate(progress: number, message: string) {
  mainWindow?.webContents.send('progress:update', { progress, message });
}
