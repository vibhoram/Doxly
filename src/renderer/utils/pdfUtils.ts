import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
}

/**
 * High-speed buffer cloning for immutable local processing
 */
const getBufferCopy = (buffer: ArrayBuffer) => {
  const copy = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(copy).set(new Uint8Array(buffer));
  return copy;
};

export const pdfUtils = {
  /**
   * Scans document structure to retrieve page metrics
   */
  async getPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
    const pdfDoc = await PDFDocument.load(getBufferCopy(pdfBuffer));
    return pdfDoc.getPageCount();
  },

  /**
   * Generates a secure visual preview of a specific document page
   */
  async generateThumbnail(pdfBuffer: ArrayBuffer, pageNumber: number = 0): Promise<string> {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: getBufferCopy(pdfBuffer) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber + 1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas context failed');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('Extraction error:', e);
      return '';
    }
  },

  /**
   * Fuses multiple document streams into a single unified object
   */
  async mergePDFs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const buffer of pdfBuffers) {
      const pdf = await PDFDocument.load(getBufferCopy(buffer));
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return await mergedPdf.save({ useObjectStreams: true });
  },

  /**
   * Cleaves specific page ranges from the document core
   */
  async splitPDF(pdfBuffer: ArrayBuffer, pageNumbers: number[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(getBufferCopy(pdfBuffer));
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, pageNumbers.map(p => p - 1));
    pages.forEach((page) => newPdf.addPage(page));
    return await newPdf.save({ useObjectStreams: true });
  },

  /**
   * Re-aligns the visual orientation of document pages
   */
  async rotatePDF(pdfBuffer: ArrayBuffer, rotation: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(getBufferCopy(pdfBuffer));
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotation));
    });
    return await pdfDoc.save({ useObjectStreams: true });
  },

  /**
   * Optimizes document object streams for minimum memory footprint
   * Quality: 0.1 (max compression) to 1.0 (min compression)
   */
  async compressPDF(pdfBuffer: ArrayBuffer, quality: number = 0.7): Promise<Uint8Array> {
    try {
      // Step 1: Load and extract all pages as images
      const loadingTask = pdfjsLib.getDocument({ data: getBufferCopy(pdfBuffer) });
      const pdf = await loadingTask.promise;
      const compressedPdf = await PDFDocument.create();
      
      // Calculate scale based on quality (lower quality = smaller images)
      // Quality 0.1 (max compression) = 0.5 scale, Quality 1.0 (min compression) = 1.5 scale
      const scale = 0.5 + (quality * 1.0);
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        // Render to canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        
        // Convert to JPEG with quality compression
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        const jpegData = jpegDataUrl.split(',')[1];
        const jpegBytes = Uint8Array.from(atob(jpegData), c => c.charCodeAt(0));
        
        // Embed compressed image
        const jpegImage = await compressedPdf.embedJpg(jpegBytes);
        const newPage = compressedPdf.addPage([viewport.width, viewport.height]);
        newPage.drawImage(jpegImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }
      
      // Step 2: Save with maximum compression settings
      return await compressedPdf.save({ 
        useObjectStreams: true,
        updateFieldAppearances: false
      });
    } catch (error) {
      console.error('Compression failed, falling back to basic optimization:', error);
      // Fallback: just optimize the structure without image re-encoding
      const pdfDoc = await PDFDocument.load(getBufferCopy(pdfBuffer));
      return await pdfDoc.save({ 
        useObjectStreams: true,
        updateFieldAppearances: false
      });
    }
  },

  /**
   * Translates document layers into visual raster assets (PNG)
   */
  async convertPDFToImages(pdfBuffer: ArrayBuffer): Promise<string[]> {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: getBufferCopy(pdfBuffer) });
      const pdf = await loadingTask.promise;
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        images.push(canvas.toDataURL('image/png'));
      }
      return images;
    } catch (e) {
      console.error('Visual extraction error:', e);
      return [];
    }
  },

  /**
   * Stacks an identification layer over the document substrate
   */
  async addWatermark(pdfBuffer: ArrayBuffer, text: string, opacity: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(getBufferCopy(pdfBuffer));
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 50,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(45),
      });
    });
    return await pdfDoc.save({ useObjectStreams: true });
  }
};
