import { useState, useEffect } from 'react';
import { X, Download, Loader2, GripVertical, Trash2, CheckCircle2, ArrowRight, Shield, FileText, Search, Layers, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store';
import { pdfUtils } from '../../utils/pdfUtils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import toast from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';

interface OrganizeToolProps {
  onClose: () => void;
}

interface PageItem {
  id: string;
  originalIndex: number;
  thumbnail: string;
}

export default function OrganizeTool({ onClose }: OrganizeToolProps) {
  const { getSelectedFiles } = useAppStore();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ name: string; size: number; blob: Blob } | null>(null);

  const selectedFiles = getSelectedFiles();
  const file = selectedFiles[0];

  useEffect(() => {
    if (file && file.data) {
      loadPages();
    }
  }, [file]);

  const loadPages = async () => {
    if (!file || !file.data) return;
    setIsGenerating(true);
    try {
      const pageCount = await pdfUtils.getPageCount(file.data);
      const items: PageItem[] = [];
      for (let i = 0; i < pageCount; i++) {
        const thumb = await pdfUtils.generateThumbnail(file.data, i);
        items.push({
          id: `page-${i}-${Math.random()}`,
          originalIndex: i,
          thumbnail: thumb
        });
        setProgress(((i + 1) / pageCount) * 100);
      }
      setPages(items);
    } catch (error) {
      console.error('Failed to load pages:', error);
      toast.error('System failed to extract document substrate');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const removePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handleApply = async () => {
    if (pages.length === 0) {
      toast.error('Cannot synthesize an empty document');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      if (!file.data) throw new Error('Data fragment corrupted');
      
      const sourceDoc = await PDFDocument.load(file.data);
      const newDoc = await PDFDocument.create();
      
      const pageIndices = pages.map(p => p.originalIndex);
      const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);
      
      copiedPages.forEach(page => newDoc.addPage(page));
      
      setProgress(80);
      const pdfBytes = await newDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      await new Promise(r => setTimeout(r, 600));
      setProgress(100);

      setResult({
        name: file.name.replace('.pdf', '_organized.pdf'),
        size: blob.size,
        blob
      });
      
      toast.success('Document structure re-aligned!');
    } catch (error: any) {
      console.error('Organize error:', error);
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

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">Extracting Layers</h3>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-8">Synchronizing Document Substrate: {Math.round(progress)}%</p>
        <div className="progress-container max-w-xs w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div className="progress-fill h-full bg-primary" animate={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

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
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Structural Re-alignment Sub-system</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reorder or purge document layers</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase">
                    <Layers className="w-3 h-3" /> {pages.length} Active Layers
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar min-h-[300px]">
                <Reorder.Group axis="y" values={pages} onReorder={setPages} className="space-y-3">
                    {pages.map((page, index) => (
                        <Reorder.Item 
                            key={page.id} 
                            value={page}
                            className="group flex items-center gap-6 p-4 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex items-center gap-4 text-slate-300">
                                <GripVertical className="w-5 h-5" />
                                <span className="text-xs font-black text-slate-900 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                            </div>
                            <div className="w-20 h-24 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                                <img src={page.thumbnail} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Original Layer</div>
                                <div className="text-xs font-bold text-slate-600">Substrate Object #{page.originalIndex + 1}</div>
                            </div>
                            <button 
                                onClick={() => removePage(page.id)}
                                className="w-10 h-10 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 flex items-center justify-center transition-colors group-hover:scale-110"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-start gap-4 mb-8">
              <Shield className="w-5 h-5 text-blue-500 mt-1" />
              <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest leading-relaxed">
                Structural synthesis occurring in volatile memory. <br/>
                Integrity maintained via Doxly Protocol v2.4.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleApply}
                disabled={isProcessing || pages.length === 0}
                className="btn btn-primary btn-glow w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Re-aligning... {Math.round(progress)}%</span>
                  </>
                ) : (
                  <>
                    <span>Execute Re-alignment</span>
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
            <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">Re-alignment Complete</h3>
            <p className="text-slate-500 font-medium mb-10">
              Successfully synthesized your document structure. <br/>
              Final Object Size: <b>{(result.size / 1024).toFixed(1)} KB</b>
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={downloadResult}
                className="btn btn-primary btn-glow w-full"
              >
                <Download className="w-5 h-5" /> Download Organized Object
              </button>
              <button 
                onClick={() => {
                   setResult(null);
                   loadPages();
                }}
                className="btn btn-primary-ghost w-full"
              >
                Continue Re-aligning
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
