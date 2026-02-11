import { useState } from 'react';
import { X, Download, Loader2, Scissors, CheckCircle2, ArrowRight, Shield, FileText } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface SplitToolProps {
  onClose: () => void;
}

export default function SplitTool({ onClose }: SplitToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [pageRanges, setPageRanges] = useState('1-3, 4-6');
  const [result, setResult] = useState<{ count: number } | null>(null);

  const selectedFiles = getSelectedFiles();

  const handleSplit = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Forge requires document selection');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const file = selectedFiles[0];
      if (!file.data) throw new Error('Data fragment corrupted');

      let splitCount = 0;
      if (splitMode === 'all') {
        for (let i = 1; i <= file.pages; i++) {
          setProgress((i / file.pages) * 90);
          const splitBuffer = await pdfUtils.splitPDF(file.data, [i]);
          const blob = new Blob([splitBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.name.replace('.pdf', `_page${i}.pdf`);
          link.click();
          URL.revokeObjectURL(url);
          splitCount++;
        }
      } else {
        const ranges = pageRanges.split(',').map(r => r.trim());
        for (let i = 0; i < ranges.length; i++) {
          setProgress((i / ranges.length) * 90);
          const range = ranges[i];
          const [start, end] = range.split('-').map(n => parseInt(n.trim()));
          const pages = [];
          for (let p = start; p <= end; p++) pages.push(p);
          
          const splitBuffer = await pdfUtils.splitPDF(file.data, pages);
          const blob = new Blob([splitBuffer.buffer as ArrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.name.replace('.pdf', `_split${i + 1}.pdf`);
          link.click();
          URL.revokeObjectURL(url);
          splitCount++;
        }
      }
      
      setProgress(100);
      setResult({ count: splitCount });
      toast.success('Document cleavage successful!');
    } catch (error: any) {
      console.error('Split error:', error);
      toast.error(error.message || 'Splitting failed');
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
                    <FileText className="w-3 h-3" /> Target File
                </div>
                {selectedFiles[0]?.name} ({selectedFiles[0]?.pages} Pages)
            </div>

            <div className="space-y-6 mb-auto">
              <div 
                onClick={() => setSplitMode('all')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                    splitMode === 'all' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${splitMode === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Scissors className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">Extract Individual Pages</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create {selectedFiles[0]?.pages} separate documents</div>
                    </div>
                </div>
              </div>

              <div 
                onClick={() => setSplitMode('range')}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                    splitMode === 'range' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${splitMode === 'range' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">Custom Selection</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Define specific page groups</div>
                        {splitMode === 'range' && (
                            <input
                              type="text"
                              value={pageRanges}
                              onChange={(e) => setPageRanges(e.target.value)}
                              placeholder="e.g., 1-3, 4-6"
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        )}
                    </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                  Local Cleavage Protocol Enabled. All page data remains in volatile system memory.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Cleaving... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Execute Splitting</span>
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
            <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-green-500/20 rotate-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Cleavage Complete!</h3>
            <p className="text-slate-500 font-medium mb-10 italic">
              Successfully generated <b>{result.count}</b> individual documents. <br/>
              Check your default downloads portal.
            </p>

            <button 
              onClick={() => setResult(null)}
              className="btn btn-primary btn-glow w-full max-w-xs"
            >
              Reset Forging
            </button>
            
            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors"
            >
              Exit Arsenal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
