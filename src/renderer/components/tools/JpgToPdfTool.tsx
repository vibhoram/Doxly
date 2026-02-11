import { useState } from 'react';
import { X, Download, Loader2, Image, CheckCircle2, ArrowRight, Shield, FileText, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';

interface JpgToPdfToolProps {
  onClose: () => void;
}

export default function JpgToPdfTool({ onClose }: JpgToPdfToolProps) {
  const [images, setImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ name: string; size: number; blob: Blob } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error('Vault requires visual assets to process');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < images.length; i++) {
        setProgress((i / images.length) * 80);
        const imgObj = images[i];
        const arrayBuffer = await imgObj.file.arrayBuffer();
        
        let embeddedImage;
        if (imgObj.file.type === 'image/jpeg' || imgObj.file.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (imgObj.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      setProgress(90);
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      await new Promise(r => setTimeout(r, 600));
      setProgress(100);

      setResult({
        name: 'doxly_visual_export.pdf',
        size: blob.size,
        blob
      });
      
      toast.success('Visual assets synthesized to PDF!');
    } catch (error: any) {
      console.error('Convert error:', error);
      toast.error(error.message || 'Synthesis failed');
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Visual Synthesis Sub-system</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synthesize JPG/PNG to PDF object</p>
                </div>
                <button 
                  onClick={() => document.getElementById('img-input')?.click()}
                  className="btn btn-outline py-2 px-4 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Assets
                </button>
                <input id="img-input" type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>

            <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar min-h-[200px] border-2 border-dashed border-slate-100 rounded-[2rem] p-6 bg-slate-50/30">
              {images.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
                    <Image className="w-12 h-12 mb-4" strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Queue Empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        <img src={img.preview} className="w-full h-full object-cover" />
                        <button 
                            onClick={() => removeImage(img.id)}
                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur shadow-sm rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-start gap-4 mb-8">
              <Shield className="w-5 h-5 text-blue-500 mt-1" />
              <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                Visual synthesis occurring in private system memory. <br/>
                No external metadata parsing or cloud sync active.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleConvert}
                disabled={isProcessing || images.length === 0}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synthesizing... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Execute Synthesis</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {isProcessing && (
                <div className="progress-container mt-4">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-10"
          >
            <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Synthesis Complete</h3>
            <p className="text-slate-500 font-medium mb-10 italic">
              Successfully generated <b>Doxly Visual Export</b> <br/>
              Final Size: <b>{(result.size / 1024).toFixed(1)} KB</b>
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary btn-glow w-full"
              >
                <Download className="w-5 h-5" /> Download Synthesis
              </button>
              <button 
                onClick={() => {
                   setResult(null);
                   setImages([]);
                }}
                className="btn btn-primary-ghost w-full"
              >
                Start New Session
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors"
            >
              Exit Sub-system
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
