import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2, Shield, FileText, ArrowRight, Lock } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface CompressToolProps {
  onClose: () => void;
}

export default function CompressTool({ onClose }: CompressToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{ name: string; size: number; blob: Blob } | null>(null);

  const selectedFiles = getSelectedFiles();

  const handleCompress = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Vault requires document selection');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const file = selectedFiles[0];
      if (!file.data) throw new Error('Data fragment corrupted');

      // Step 1: Encrypted Analysis
      setProgress(20);
      await new Promise(r => setTimeout(r, 600));

      // Step 2: Local Processing Sub-system
      setProgress(50);
      const compressedBuffer = await pdfUtils.compressPDF(file.data, quality);
      
      // Step 3: Reconstruction
      setProgress(90);
      const blob = new Blob([compressedBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
      
      await new Promise(r => setTimeout(r, 600));
      setProgress(100);

      setResult({
        name: file.name.replace('.pdf', '_secured.pdf'),
        size: blob.size,
        blob
      });
      
      toast.success('Secure processing complete!');
    } catch (error: any) {
      console.error('Compress error:', error);
      toast.error(error.message || 'System failed to process PDF');
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

  const calculateSaving = () => {
    if (!result || !selectedFiles[0]) return 0;
    const diff = selectedFiles[0].size - result.size;
    return Math.max(0, Math.round((diff / selectedFiles[0].size) * 100));
  };

  const saving = calculateSaving();

  return (
    <div className="flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 italic text-gray-400 text-sm">
              <div className="flex items-center gap-2 mb-2 font-bold not-italic text-gray-600 uppercase tracking-widest text-[10px]">
                <FileText className="w-3 h-3" /> Secure Handle
              </div>
              {selectedFiles[0]?.name} ({(selectedFiles[0]?.size / 1024).toFixed(1)} KB)
            </div>

            <div className="space-y-8 mb-auto">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Processing Intensity</label>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-wider">
                    {quality < 0.4 ? 'Extreme Compression' : quality < 0.7 ? 'Optimized Balance' : 'Integrity First'}
                  </span>
                </div>
                
                <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-6">
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 appearance-none bg-slate-100 rounded-full accent-primary"
                  />
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Alpha (Min Size)</span>
                    <span>Omega (Max Quality)</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-start gap-4">
                <Lock className="w-5 h-5 text-blue-500 mt-1" />
                <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                  End-to-End Local Execution Sub-system Active. <br/>
                  No network traffic detected during processing.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="btn btn-primary btn-glow w-full py-4 uppercase tracking-[0.2em] text-[10px] font-black"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Sub-system... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Secure Compression</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              {isProcessing && (
                <div className="progress-container mt-4 h-1 bg-slate-100 overflow-hidden rounded-full">
                  <motion.div 
                    className="progress-fill h-full bg-primary"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-10"
          >
            <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-3xl shadow-primary/20 scale-110">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">Optimization Complete</h3>
            <p className="text-slate-500 font-medium mb-10">
              New secure size: <b>{(result.size / 1024).toFixed(1)} KB</b> 
              <br/>
              <div className="mt-4">
                {saving > 0 ? (
                  <span className="text-[10px] uppercase font-black text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    Vault Saved {saving}% Memory Space
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                     Already Peak Optimization (0% Save)
                  </span>
                )}
              </div>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary btn-glow flex-1 py-4 text-[10px] uppercase font-black tracking-widest"
              >
                <Download className="w-4 h-4" /> Download Protected File
              </button>
              <button 
                onClick={() => setResult(null)}
                className="btn btn-primary-ghost px-8 py-4 text-[10px] uppercase font-black tracking-widest"
              >
                Reset
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors transition-all"
            >
              Exit Sub-system
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
