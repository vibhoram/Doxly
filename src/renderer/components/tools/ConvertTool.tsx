import { useState } from 'react';
import { X, Download, Loader2, Files, CheckCircle2, ArrowRight, Shield, FileText, Image } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ConvertToolProps {
  onClose: () => void;
}

export default function ConvertTool({ onClose }: ConvertToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ pageCount: number } | null>(null);

  const selectedFiles = getSelectedFiles();

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Forge requires document selection');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const file = selectedFiles[0];
      if (!file.data) throw new Error('Data fragment corrupted');

      setProgress(20);
      const images = await pdfUtils.convertPDFToImages(file.data);

      setProgress(80);
      images.forEach((imageData, index) => {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = file.name.replace('.pdf', `_page${index + 1}.png`);
        link.click();
      });

      setProgress(100);
      setResult({ pageCount: images.length });
      toast.success('Visual extraction successful!');
    } catch (error: any) {
      console.error('Convert error:', error);
      toast.error(error.message || 'Conversion failed');
    } finally {
      setIsProcessing(false);
    }
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
            <div className="mb-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 italic text-gray-400 text-sm">
                <div className="flex items-center gap-2 mb-2 font-bold not-italic text-gray-600 uppercase tracking-widest text-[10px]">
                    <FileText className="w-3 h-3" /> Source Object
                </div>
                {selectedFiles[0]?.name}
            </div>

            <div className="space-y-8 mb-auto text-center py-12">
               <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <Image className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">High-Fidelity Extraction</h3>
               <p className="text-slate-500 font-medium max-w-sm mx-auto">
                 We will deconstruct every page of your PDF into professional-grade PNG image assets.
               </p>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 mb-8">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                Visual Forge Offline. No external GPU clusters detected. 100% On-Disk integrity.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Extracting... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Execute Extraction</span>
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
            <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 -rotate-3">
              <Image className="w-12 h-12" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Extraction Complete</h3>
            <p className="text-slate-500 font-medium mb-10 italic">
              Successfully forged <b>{result.pageCount}</b> visual assets. <br/>
              Check your default downloads portal.
            </p>

            <button 
              onClick={() => setResult(null)}
              className="btn btn-primary btn-glow w-full max-w-xs"
            >
              Start New Extraction
            </button>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors"
            >
              Exit Extraction Arsenal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
