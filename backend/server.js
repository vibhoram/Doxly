const express = require('express');
const cors = require('cors');
const multer = require('multer');
const libre = require('libreoffice-convert');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 3001;

// Convert libre.convert to promise
const convertAsync = promisify(libre.convert);

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Doxly Backend is running!' });
});

// ============================================
// ANALYTICS SYSTEM (GOD MODE) 👁️
// ============================================
const analyticsDB = {
  events: [],
  sessions: new Map()
};

// Analytics endpoint - receive events from frontend
app.post('/api/analytics', (req, res) => {
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid events data' });
    }

    // Store events
    analyticsDB.events.push(...events);

    // Update session tracking
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
    });

    // Keep only last 10k events to prevent memory issues
    if (analyticsDB.events.length > 10000) {
      analyticsDB.events = analyticsDB.events.slice(-10000);
   }

    res.json({ success: true, eventsReceived: events.length });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Analytics failed' });
  }
});

// Analytics stats endpoint - view the data
app.get('/api/analytics/stats', (req, res) => {
  try {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last7d = now - (7 * 24 * 60 * 60 * 1000);

    // Filter events by time
    const events24h = analyticsDB.events.filter(e => e.timestamp > last24h);
    const events7d = analyticsDB.events.filter(e => e.timestamp > last7d);

    // Calculate stats
    const toolUsage = {};
    events24h.filter(e => e.event === 'tool_complete').forEach(e => {
      toolUsage[e.tool] = (toolUsage[e.tool] || 0) + 1;
    });

    const activeSessions = Array.from(analyticsDB.sessions.values())
      .filter(s => s.lastActive > last24h);

    const stats = {
      overview: {
        totalEvents: analyticsDB.events.length,
        totalSessions: analyticsDB.sessions.size,
        activeSessions24h: activeSessions.length
      },
      last24h: {
        events: events24h.length,
        toolUsage,
        uniqueTools: Object.keys(toolUsage).length
      },
      last7d: {
        events: events7d.length
      },
      topTools: Object.entries(toolUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tool, count]) => ({ tool, count }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Stats failed' });
  }
});


// Word to PDF
app.post('/api/convert/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pdf`);

    // Read the docx file
    const docxBuf = await fs.readFile(inputPath);

    // Convert to PDF
    const pdfBuf = await convertAsync(docxBuf, '.pdf', undefined);

    // Write PDF file
    await fs.writeFile(outputPath, pdfBuf);

    // Send file to client
    res.download(outputPath, 'converted.pdf', async (err) => {
      // Cleanup files after sending
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
      
      if (err) console.error('Download error:', err);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// Excel to PDF
app.post('/api/convert/excel-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pdf`);

    const xlsxBuf = await fs.readFile(inputPath);
    const pdfBuf = await convertAsync(xlsxBuf, '.pdf', undefined);
    await fs.writeFile(outputPath, pdfBuf);

    res.download(outputPath, 'converted.pdf', async (err) => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
      if (err) console.error('Download error:', err);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// PowerPoint to PDF
app.post('/api/convert/ppt-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pdf`);

    const pptxBuf = await fs.readFile(inputPath);
    const pdfBuf = await convertAsync(pptxBuf, '.pdf', undefined);
    await fs.writeFile(outputPath, pdfBuf);

    res.download(outputPath, 'converted.pdf', async (err) => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
      if (err) console.error('Download error:', err);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// PDF to Word
app.post('/api/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.docx`);

    const pdfBuf = await fs.readFile(inputPath);
    const docxBuf = await convertAsync(pdfBuf, '.docx', undefined);
    await fs.writeFile(outputPath, docxBuf);

    res.download(outputPath, 'converted.docx', async (err) => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
      if (err) console.error('Download error:', err);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// PDF to PowerPoint
app.post('/api/convert/pdf-to-ppt', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.pptx`);

    const pdfBuf = await fs.readFile(inputPath);
    const pptxBuf = await convertAsync(pdfBuf, '.pptx', undefined);
    await fs.writeFile(outputPath, pptxBuf);

    res.download(outputPath, 'converted.pptx', async (err) => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
      if (err) console.error('Download error:', err);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// PDF to Excel
app.post('/api/convert/pdf-to-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(UPLOAD_DIR, `${uuidv4()}.xlsx`);

    const pdfBuf = await fs.readFile(inputPath);
    const xlsxBuf = await convertAsync(pdfBuf, '.xlsx', undefined);
    await fs.writeFile(outputPath, xlsxBuf);

    res.download(outputPath, 'converted.xlsx', async (err) => {
      await fs.remove(inputPath).catch(console.error);
      await fs.remove(outputPath).catch(console.error);
      if (err) console.error('Download error:', err);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// Cleanup old files on startup
async function cleanupTempFiles() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    for (const file of files) {
      await fs.remove(path.join(UPLOAD_DIR, file));
    }
    console.log('✅ Temp files cleaned');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  await cleanupTempFiles();
  console.log(`🚀 Doxly Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
