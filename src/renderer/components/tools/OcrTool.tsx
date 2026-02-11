import { useState } from 'react';
import { Download, Loader2, CheckCircle2, ArrowRight, Shield, FileText, Lock, ScanLine } from 'lucide-react';
import { useAppStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createWorker } from 'tesseract.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { pdfUtils } from '../../utils/pdfUtils';

interface OcrToolProps {
  onClose: () => void;
}

export default function OcrTool({ onClose }: OcrToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{ name: string; size: number; blob: Blob; text: string } | null>(null);

  const selectedFiles = getSelectedFiles();
  const file = selectedFiles[0];

  const handleOcr = async () => {
    if (!file || !file.data) {
      toast.error('System requires document substrate');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setStatus('Initializing Neural Engine...');

    try {
      // Step 1: Extract Images from PDF
      setStatus('Visual Layer Decomposition...');
      const imageUrls = await pdfUtils.convertPDFToImages(file.data);
      
      // Step 2: Initialize Tesseract
      setStatus('Calibrating Language Hub...');
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress * 100);
          }
        }
      });

      let fullText = '';
      
      // Step 3: OCR Each Image
      for (let i = 0; i < imageUrls.length; i++) {
        setStatus(`Recognizing Layer ${i + 1}/${imageUrls.length}...`);
        const { data: { text } } = await worker.recognize(imageUrls[i]);
        fullText += text + '\n\n';
      }

      await worker.terminate();

      // Step 4: Synthesize Searchable PDF (Basic Text Layer Append)
      setStatus('Synthesizing Searchable Object...');
      const pdfDoc = await PDFDocument.create();
      const pagesText = fullText.split('\n\n');
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      pagesText.forEach(p => {
        if (!p.trim()) return;
        const page = pdfDoc.addPage();
        const { height } = page.getSize();
        page.drawText(p.substring(0, 2000), { // Basic truncation for stability
          x: 50,
          y: height - 100,
          size: 10,
          font,
          color: rgb(0, 0, 0),
          maxWidth: 500,
          lineHeight: 12
        });
      });

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      // Convert Uint8Array to ArrayBuffer for Blob stability across environments
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

      setProgress(100);
      setResult({
        name: file.name.replace('.pdf', '_searchable.pdf'),
        size: blob.size,
        blob,
        text: fullText
      });
      
      toast.success('Neural recognition complete!');
    } catch (error: any) {
      console.error('OCR error:', error);
      toast.error(error.message || 'Recognition failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.text);
    toast.success('Plaintext secured to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-10 p-6 rounded-3xl bg-slate-50 border border-slate-100 italic text-gray-400 text-sm">
                <div className="flex items-center gap-2 mb-2 font-bold not-italic text-gray-600 uppercase tracking-widest text-[10px]">
                    <FileText className="w-3" /> Target Handle
                </div>
                {file?.name}
            </div>

            <div className="space-y-12 mb-auto py-10 text-center">
               <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
                  <ScanLine className="w-10 h-10" />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Neural OCR Sub-system</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Deconstruct document layers to identify visual text and synthesize searchable assets.
                  </p>
               </div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-start gap-4 mb-10">
              <Lock className="w-5 h-5 text-blue-500 mt-1" />
              <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                Local-AI protocol engaged. Language models running in volatile memory. <br/>
                Absolute zero tracking data leakage.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleOcr}
                disabled={isProcessing}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{status} {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Execute Recognition</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-10"
          >
            <div className="w-24 h-24 bg-primary text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(99,102,241,0.3)]">
              <Shield className="w-12 h-12" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">Recognition Successful</h3>
            <p className="text-slate-500 font-medium mb-10">
              Neural engine successfully identified text in <b>{file.name}</b>.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary w-full"
              >
                <Download className="w-5 h-5" /> Download Searchable PDF
              </button>
              <button 
                onClick={copyText}
                className="btn btn-primary-ghost w-full"
              >
                <FileText className="w-5 h-5" /> Secure Plaintext to Clipboard
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-all underline decoration-slate-100 underline-offset-8"
            >
              Exit Sub-system
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
