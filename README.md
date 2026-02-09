# PDF ProForge

Professional offline PDF toolkit with unlimited file size support - built with Electron, React, and TypeScript.

## Features

- 🔄 **Merge** - Combine multiple PDFs into one
- ✂️ **Split** - Extract pages from PDFs
- 🔄 **Rotate** - Rotate PDF pages (90°, 180°, 270°)
- 📦 **Compress** - Reduce file size with quality control
- 🔄 **Convert** - PDF ↔ Office formats (requires LibreOffice)
- 📄 **Extract** - Extract specific pages
- ✏️ **Add Text** - Add text overlays
- 💧 **Watermark** - Add text watermarks
- 🔒 **Protect** - Password protection
- 🎨 **Optimize** - Advanced PDF optimization

## Tech Stack

- **Electron 32+** - Desktop app framework
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **PDF-lib** - PDF manipulation
- **PDF.js** - PDF rendering
- **Zustand** - State management

## Prerequisites

- Node.js 18+
- npm or yarn
- LibreOffice (for Office conversions)

## Installation

```bash
# Install dependencies
npm install

# Run development mode
npm run dev

# Build for production
npm run build

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac
```

## Development

```bash
# Start dev server (Vite + Electron)
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## LibreOffice Setup

For PDF ↔ Office conversions:

**Windows:** Download and install from [libreoffice.org](https://www.libreoffice.org/)

**macOS:** `brew install --cask libreoffice`

**Linux:** `sudo apt install libreoffice` or equivalent

## Features

- ✅ 100% offline - no internet required
- ✅ Unlimited file size (1GB+ supported)
- ✅ Dark/Light theme
- ✅ Drag & drop support
- ✅ Batch processing
- ✅ File previews
- ✅ Keyboard shortcuts
- ✅ Modern glassmorphism UI

## Keyboard Shortcuts

- `Cmd/Ctrl + M` - Merge tool
- `Cmd/Ctrl + S` - Split tool
- `Cmd/Ctrl + R` - Rotate tool
- `Cmd/Ctrl + ,` - Settings

## License

MIT

## Support

For issues and feature requests, please create an issue on GitHub.
