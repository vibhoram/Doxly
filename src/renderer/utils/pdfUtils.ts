import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const pdfUtils = {
  /**
   * Merge multiple PDF files into one
   */
  async mergePDFs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    return await mergedPdf.save();
  },

  /**
   * Split PDF into individual pages or ranges
   */
  async splitPDF(
    pdfBuffer: ArrayBuffer,
    ranges: { start: number; end: number }[]
  ): Promise<Uint8Array[]> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const results: Uint8Array[] = [];

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(
        pdfDoc,
        Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i)
      );
      pages.forEach((page) => newPdf.addPage(page));
      results.push(await newPdf.save());
    }

    return results;
  },

  /**
   * Extract specific pages from PDF
   */
  async extractPages(pdfBuffer: ArrayBuffer, pageNumbers: number[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(pdfDoc, pageNumbers);
    pages.forEach((page) => newPdf.addPage(page));

    return await newPdf.save();
  },

  /**
   * Rotate PDF pages
   */
  async rotatePDF(
    pdfBuffer: ArrayBuffer,
    rotation: 90 | 180 | 270,
    pageNumbers?: number[]
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();

    const pagesToRotate = pageNumbers || pages.map((_, i) => i);

    pagesToRotate.forEach((pageNum) => {
      if (pageNum < pages.length) {
        const page = pages[pageNum];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      }
    });

    return await pdfDoc.save();
  },

  /**
   * Add text to PDF
   */
  async addTextToPDF(
    pdfBuffer: ArrayBuffer,
    text: string,
    options: {
      page: number;
      x: number;
      y: number;
      size?: number;
      color?: { r: number; g: number; b: number };
      font?: string;
    }
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const page = pages[options.page];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = options.size || 12;
    const color = options.color || { r: 0, g: 0, b: 0 };

    page.drawText(text, {
      x: options.x,
      y: options.y,
      size: fontSize,
      font: font,
      color: rgb(color.r, color.g, color.b)
    });

    return await pdfDoc.save();
  },

  /**
   * Add watermark to PDF
   */
  async addWatermark(
    pdfBuffer: ArrayBuffer,
    watermarkText: string,
    options?: {
      opacity?: number;
      size?: number;
      rotation?: number;
    }
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const opacity = options?.opacity || 0.3;
    const size = options?.size || 60;
    const rotation = options?.rotation || 45;

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - (watermarkText.length * size) / 4,
        y: height / 2,
        size: size,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: opacity,
        rotate: degrees(rotation)
      });
    });

    return await pdfDoc.save();
  },

  /**
   * Compress PDF (reduce quality)
   */
  async compressPDF(
    pdfBuffer: ArrayBuffer,
    quality: number = 0.7
  ): Promise<Uint8Array> {
    // Note: pdf-lib doesn't have built-in compression
    // This is a simplified version that re-saves the PDF
    // For real compression, you'd need additional libraries
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Save with reduced options
    return await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false
    });
  },

  /**
   * Get PDF page count
   */
  async getPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    return pdfDoc.getPageCount();
  },

  /**
   * Generate PDF thumbnail using PDF.js
   */
  async generateThumbnail(pdfBuffer: ArrayBuffer, pageNumber: number = 0): Promise<string> {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber + 1); // PDF.js uses 1-based indexing

      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '';
    }
  },

  /**
   * Protect PDF with password
   */
  async protectPDF(
    pdfBuffer: ArrayBuffer,
    userPassword: string,
    ownerPassword?: string
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Note: pdf-lib has limited encryption support
    // For production, you might need a different library
    // This is a placeholder for the concept
    
    return await pdfDoc.save();
  },

  /**
   * Convert PDF to grayscale
   */
  async convertToGrayscale(pdfBuffer: ArrayBuffer): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    // Note: This is a placeholder - actual grayscale conversion
    // would require image processing of embedded images
    return await pdfDoc.save();
  },

  /**
   * Reorder pages in PDF
   */
  async reorderPages(pdfBuffer: ArrayBuffer, newOrder: number[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(pdfDoc, newOrder);
    pages.forEach((page) => newPdf.addPage(page));

    return await newPdf.save();
  }
};
