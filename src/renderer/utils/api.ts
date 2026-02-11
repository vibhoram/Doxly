// API Configuration for Doxly Backend
// Replace 'YOUR_RAILWAY_URL' with your actual Railway URL after deployment

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Office Conversions
  wordToPdf: (file: File) => uploadAndConvert(file, '/api/convert/word-to-pdf'),
  excelToPdf: (file: File) => uploadAndConvert(file, '/api/convert/excel-to-pdf'),
  pptToPdf: (file: File) => uploadAndConvert(file, '/api/convert/ppt-to-pdf'),
  pdfToWord: (file: File) => uploadAndConvert(file, '/api/convert/pdf-to-word'),
  pdfToPpt: (file: File) => uploadAndConvert(file, '/api/convert/pdf-to-ppt'),
  pdfToExcel: (file: File) => uploadAndConvert(file, '/api/convert/pdf-to-excel'),
};

async function uploadAndConvert(file: File, endpoint: string): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Conversion failed' }));
    throw new Error(error.error || 'Conversion failed');
  }

  return await response.blob();
}

export default api;
