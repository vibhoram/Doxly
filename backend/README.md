# Doxly Backend API

Backend service for Office document conversions using LibreOffice.

## Endpoints

### Health Check
```
GET /health
```

### Conversions

**Word to PDF**
```
POST /api/convert/word-to-pdf
Content-Type: multipart/form-data
Body: file (. docs/.docx)
```

**Excel to PDF**
```
POST /api/convert/excel-to-pdf
Content-Type: multipart/form-data
Body: file (.xls/.xlsx)
```

**PowerPoint to PDF**
```
POST /api/convert/ppt-to-pdf
Content-Type: multipart/form-data
Body: file (.ppt/.pptx)
```

**PDF to Word**
```
POST /api/convert/pdf-to-word
Content-Type: multipart/form-data
Body: file (.pdf)
```

**PDF to PowerPoint**
```
POST /api/convert/pdf-to-ppt
Content-Type: multipart/form-data
Body: file (.pdf)
```

**PDF to Excel**
```
POST /api/convert/pdf-to-excel
Content-Type: multipart/form-data
Body: file (.pdf)
```

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Railway

1. Push this folder to GitHub
2. Connect Railway to your repo
3. Railway will auto-detect and deploy
4. Get your API URL from Railway dashboard

## Environment Variables

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Your frontend URL for CORS (optional)
