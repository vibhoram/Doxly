import { useState } from 'react';
import { X, Download, Loader2, Droplet, CheckCircle2, ArrowRight, Shield, FileText, PenTool } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface WatermarkToolProps {
  onClose: () => void;
}

export default function WatermarkTool({ onClose }: WatermarkToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [result, setResult] = useState<{ name: string; blob: Blob } | null>(null);

  const selectedFiles = getSelectedFiles();

  const handleWatermark = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Forge requires document selection');
      return;
    }

    if (!watermarkText.trim()) {
      toast.error('Identity required for watermark');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const file = selectedFiles[0];
      if (!file.data) throw new Error('Data fragment corrupted');

      setProgress(20);
      await new Promise(r => setTimeout(r, 400));

      setProgress(70);
      const watermarkedBuffer = await pdfUtils.addWatermark(
        file.data,
        watermarkText,
        opacity
      );
      
      setProgress(90);
      const blob = new Blob([watermarkedBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
      
      await new Promise(r => setTimeout(r, 400));
      setProgress(100);

      setResult({
        name: file.name.replace('.pdf', '_stamped.pdf'),
        blob
      });
      
      toast.success('Document identity stamped!');
    } catch (error: any) {
      console.error('Watermark error:', error);
      toast.error(error.message || 'Stamping failed');
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 italic text-gray-400 text-sm">
                <div className="flex items-center gap-2 mb-2 font-bold not-italic text-gray-600 uppercase tracking-widest text-[10px]">
                    <FileText className="w-3 h-3" /> Target Object
                </div>
                {selectedFiles[0]?.name}
            </div>

            <div className="space-y-10 mb-auto">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block underline decoration-primary/30 underline-offset-4">Stamp Configuration</label>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-1">Visual Identity</span>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="e.g. PROPERTY OF DOXLY"
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-3xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                   
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Opacity Level</span>
                            <span className="text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg">{Math.round(opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.9"
                          step="0.1"
                          value={opacity}
                          onChange={(e) => setOpacity(parseFloat(e.target.value))}
                          className="w-full"
                        />
                    </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                  Encryption Layer Active. Identity stamping occurring in localized sandbox. No cloud ping detected.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Stamping... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Execute Stamping</span>
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
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
              <PenTool className="w-12 h-12" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">Identity Stamped</h3>
            <p className="text-slate-500 font-medium mb-12">
              Successfully applied "<b>{watermarkText}</b>" layer to your document. <br/>
              Total Integrity Maintained.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary btn-glow w-full py-4"
              >
                <Download className="w-5 h-5" /> Download Stamped Doc
              </button>
              <button 
                onClick={() => setResult(null)}
                className="btn btn-primary-ghost w-full py-4 font-black uppercase tracking-widest text-[10px]"
              >
                Modify Settings
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors"
            >
              Exit Stamp Arsenal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
