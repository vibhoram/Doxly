import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2, RotateCw, ArrowRight, Shield, FileText } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface RotateToolProps {
  onClose: () => void;
}

export default function RotateTool({ onClose }: RotateToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [result, setResult] = useState<{ name: string; size: number; blob: Blob } | null>(null);

  const selectedFiles = getSelectedFiles();

  const handleRotate = async () => {
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
      await new Promise(r => setTimeout(r, 400));

      setProgress(60);
      const rotatedBuffer = await pdfUtils.rotatePDF(file.data, rotation);
      
      setProgress(90);
      const blob = new Blob([rotatedBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
      
      await new Promise(r => setTimeout(r, 600));
      setProgress(100);

      setResult({
        name: file.name.replace('.pdf', '_rotated.pdf'),
        size: blob.size,
        blob
      });
      
      toast.success('Document orientation fixed!');
    } catch (error: any) {
      console.error('Rotate error:', error);
      toast.error(error.message || 'Rotation failed');
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-10 p-6 rounded-2xl bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{selectedFiles[0]?.name}</div>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Target</div>
            </div>

            <div className="space-y-10 mb-auto">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block">Select Rotation Angle</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[90, 180, 270, 0].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      className={`relative p-6 rounded-3xl border-2 transition-all duration-300 group ${
                        rotation === angle
                          ? 'border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10'
                          : 'border-slate-100 bg-white hover:border-slate-200 text-slate-400'
                      }`}
                    >
                      <RotateCw className={`w-8 h-8 mx-auto mb-3 transition-transform duration-500 ${rotation === angle ? 'rotate-12' : ''}`} strokeWidth={1.5} />
                      <div className="text-sm font-black tracking-tight">{angle === 0 ? 'RESET' : `+${angle}°`}</div>
                      {rotation === angle && (
                          <motion.div layoutId="angle-active" className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                              <CheckCircle2 className="w-2 h-2 text-white" />
                          </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-start gap-4">
                <Shield className="w-5 h-5 text-blue-500 mt-1" />
                <p className="text-[10px] text-blue-800 font-bold leading-relaxed uppercase tracking-widest">
                  Forging orientation locally. No cloud sync detected. <br/>
                  Total Privacy Protocol 0110 in effect.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleRotate}
                disabled={isProcessing}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Forge... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Apply Rotation</span>
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
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 relative">
              <RotateCw className="w-12 h-12 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                  <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Orientation Stabilized</h3>
            <p className="text-slate-500 font-medium mb-12">
              Your document has been re-oriented correctly. <br/>
              <b>{(result.size / 1024).toFixed(1)} KB</b> • Perfect Integrity
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary btn-glow w-full py-4"
              >
                <Download className="w-5 h-5" /> Download Document
              </button>
              <button 
                onClick={() => setResult(null)}
                className="btn btn-primary-ghost w-full py-4 font-black uppercase tracking-widest text-[10px]"
              >
                Reset Rotation
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors"
            >
              Exit Workflow
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
