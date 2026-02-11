const express = require('express');
const cors = require('cors');
const multer = require('multer');
const libre = require('libreoffice-convert');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4777;

// Convert libre.convert to promise
const convertAsync = promisify(libre.convert);

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

// ============================================
// GLOBAL SYSTEM STATE (GOD MODE) 👁️
// ============================================
const systemState = {
  maintenanceMode: false,
  systemMessage: ""
};

const analyticsDB = {
  events: [],
  sessions: new Map()
};

// Create temp directory for uploads
const UPLOAD_DIR = path.join(__dirname, 'temp');
fs.ensureDirSync(UPLOAD_DIR);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Middleware to block traffic if maintenance is active
app.use((req, res, next) => {
  if (systemState.maintenanceMode && !req.path.startsWith('/api/admin') && !req.path.startsWith('/api/analytics/stats')) {
    return res.status(503).json({ 
      error: 'System Maintenance', 
      message: systemState.systemMessage || 'Doxly is currently undergoing orbital maintenance.' 
    });
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Doxly Backend is running!', ...systemState });
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
  try {
    const { events } = req.body;
    if (!events || !Array.isArray(events)) return res.status(400).json({ error: 'Invalid data' });

    analyticsDB.events.push(...events);
    events.forEach(event => {
      if (!analyticsDB.sessions.has(event.sessionId)) {
        analyticsDB.sessions.set(event.sessionId, {
          sessionId: event.sessionId,
          startTime: event.timestamp,
          lastActive: event.timestamp,
          events: []
        });
      }
      const session = analyticsDB.sessions.get(event.sessionId);
      session.lastActive = event.timestamp;
      session.events.push(event);
      
      // REAL-TIME BROADCAST TO ADMIN
      io.emit('admin_event_stream', event);
    });

    if (analyticsDB.events.length > 10000) analyticsDB.events = analyticsDB.events.slice(-10000);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Analytics failed' });
  }
});

app.get('/api/analytics/stats', (req, res) => {
  const toolUsage = {};
  analyticsDB.events.filter(e => e.event === 'tool_complete').forEach(e => {
    toolUsage[e.tool] = (toolUsage[e.tool] || 0) + 1;
  });
  res.json({
    overview: {
      totalEvents: analyticsDB.events.length,
      totalSessions: analyticsDB.sessions.size,
      maintenance: systemState.maintenanceMode
    },
    last24h: {
      events: analyticsDB.events.filter(e => e.timestamp > Date.now() - 86400000).length,
      toolUsage
    },
    topTools: Object.entries(toolUsage).sort(([,a], [,b]) => b - a).slice(0, 10).map(([tool, count]) => ({ tool, count }))
  });
});

// ============================================
// ACTUAL GOD POWERS (ADMIN ONLY) ⚡
// ============================================

// 1. Toggle Maintenance Mode
app.post('/api/admin/maintenance', (req, res) => {
  const { active, message } = req.body;
  systemState.maintenanceMode = active;
  systemState.systemMessage = message || "";
  io.emit('system_update', systemState);
  res.json({ success: true, ...systemState });
});

// 2. Global Broadcast (Show message to all users)
app.post('/api/admin/broadcast', (req, res) => {
  const { message, type = 'info' } = req.body;
  io.emit('global_broadcast', { message, type });
  res.json({ success: true });
});

// 3. Force Refresh All Clients
app.post('/api/admin/force-refresh', (req, res) => {
  io.emit('force_refresh');
  res.json({ success: true });
});

// 4. Wipe Everything
app.post('/api/admin/wipe', async (req, res) => {
  analyticsDB.events = [];
  analyticsDB.sessions.clear();
  await cleanupTempFiles();
  res.json({ success: true, message: 'System wiped clean' });
});

// Word to PDF
app.post('/api/convert/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pdf`);
    const docxBuf = await fs.readFile(inputPath);
    const pdfBuf = await convertAsync(docxBuf, '.pdf', undefined);
    await fs.writeFile(outputPath, pdfBuf);
    res.download(outputPath, 'converted.pdf', async () => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Excel to PDF
app.post('/api/convert/excel-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pdf`);

    const xlsxBuf = await fs.readFile(inputPath);
    const pdfBuf = await convertAsync(xlsxBuf, '.pdf', undefined);
    await fs.writeFile(outputPath, pdfBuf);

    res.download(outputPath, 'converted.pdf', async () => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// PowerPoint to PDF
app.post('/api/convert/ppt-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pdf`);

    const pptxBuf = await fs.readFile(inputPath);
    const pdfBuf = await convertAsync(pptxBuf, '.pdf', undefined);
    await fs.writeFile(outputPath, pdfBuf);

    res.download(outputPath, 'converted.pdf', async () => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// PDF to Word
app.post('/api/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.docx`);

    const pdfBuf = await fs.readFile(inputPath);
    const docxBuf = await convertAsync(pdfBuf, '.docx', undefined);
    await fs.writeFile(outputPath, docxBuf);

    res.download(outputPath, 'converted.docx', async () => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// PDF to PowerPoint
app.post('/api/convert/pdf-to-ppt', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pptx`);

    const pdfBuf = await fs.readFile(inputPath);
    const pptxBuf = await convertAsync(pdfBuf, '.pptx', undefined);
    await fs.writeFile(outputPath, pptxBuf);

    res.download(outputPath, 'converted.pptx', async () => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// PDF to Excel
app.post('/api/convert/pdf-to-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.xlsx`);

    const pdfBuf = await fs.readFile(inputPath);
    const xlsxBuf = await convertAsync(pdfBuf, '.xlsx', undefined);
    await fs.writeFile(outputPath, xlsxBuf);

    res.download(outputPath, 'converted.xlsx', async () => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

async function cleanupTempFiles() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    for (const file of files) await fs.remove(path.join(UPLOAD_DIR, file));
    console.log('✅ Temp files cleaned');
  } catch (error) {}
}

io.on('connection', (socket) => {
  console.log('🔗 Client connected:', socket.id);
  socket.emit('system_update', systemState);
});

server.listen(PORT, async () => {
  await cleanupTempFiles();
  console.log(`🚀 Doxly GOD-MODE Engine running on port ${PORT}`);
});
