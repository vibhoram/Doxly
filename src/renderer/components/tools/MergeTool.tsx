import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2, Layout, Files, ArrowRight, Shield, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface MergeToolProps {
  onClose: () => void;
}

export default function MergeTool({ onClose }: MergeToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ name: string; size: number; blob: Blob } | null>(null);

  // Note: For merge, we use all selected files
  const selectedFiles = getSelectedFiles();

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      toast.error('Forge requires minimum 2 files to merge');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Step 1: Initializing
      setProgress(10);
      await new Promise(r => setTimeout(r, 400));
      
      const buffers = selectedFiles.map(file => {
        if (!file.data) throw new Error(`Data fragment lost for ${file.name}`);
        return file.data;
      });

      // Step 2: Merging
      setProgress(40);
      const mergedBuffer = await pdfUtils.mergePDFs(buffers);

      // Step 3: Finalizing
      setProgress(80);
      const blob = new Blob([mergedBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
      
      await new Promise(r => setTimeout(r, 600));
      setProgress(100);

      setResult({
        name: 'merged_ninja.pdf',
        size: blob.size,
        blob
      });
      
      toast.success('Documents fused successfully!');
    } catch (error: any) {
      console.error('Merge error:', error);
      toast.error(error.message || 'Fusion failed');
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Files className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-xs tracking-widest text-slate-400 uppercase">Fusion Queue</h3>
                  <div className="text-sm font-bold text-slate-900">{selectedFiles.length} Documents</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-12 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedFiles.map((file, idx) => (
                <div key={file.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm relative group">
                  <span className="text-[10px] font-black w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{file.name}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase">{(file.size / 1024).toFixed(0)} KB • {file.pages} Pages</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3 mb-auto">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="text-[10px] text-blue-800 font-bold leading-relaxed uppercase tracking-wider">
                Encryption Active. Fusion occurring in high-speed local memory. <br/>
                No external data transmission detected.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleMerge}
                disabled={isProcessing || selectedFiles.length < 2}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Fusion... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Start Fusion</span>
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-10"
          >
            <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/30 rotate-12">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Fusion Successful!</h3>
            <p className="text-slate-500 font-medium mb-10 max-w-xs">
              Your documents have been merged into a single 
              high-performance PDF <b>({(result.size / 1024).toFixed(1)} KB)</b>.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary btn-glow w-full py-4 text-sm"
              >
                <Download className="w-5 h-5" /> Download Result
              </button>
              <button 
                onClick={() => setResult(null)}
                className="btn btn-primary-ghost w-full py-4 text-sm font-black uppercase tracking-widest"
              >
                New Fusion
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              Finish Workflow
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
