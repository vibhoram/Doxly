import { useState, useCallback } from 'react';
import { FileUp, Loader2, Files, Shield, Lock } from 'lucide-react';
import { useAppStore } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { pdfUtils } from '../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function FileUpload() {
  const { addFiles } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    setIsProcessing(true);
    setProgress(0);

    try {
      const processedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        let pages = 0;
        let thumbnail = '';

        if (file.name.endsWith('.pdf')) {
          try {
            pages = await pdfUtils.getPageCount(buffer);
            thumbnail = await pdfUtils.generateThumbnail(buffer);
          } catch (error) {
            console.error('Error processing PDF:', error);
          }
        }

        processedFiles.push({
          id: uuidv4(),
          name: file.name,
          path: (file as any).path || '',
          size: file.size,
          pages,
          thumbnail,
          selected: true,
          created: new Date(),
          data: buffer,
        });
        
        // Update progress bar
        setProgress(((i + 1) / files.length) * 100);
      }

      addFiles(processedFiles);
      toast.success(`Succesfully Secured ${processedFiles.length} file(s)`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to secure files');
    } finally {
      // Small delay for the animation to finish
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="p-12 text-center rounded-3xl border-2 border-primary/20 bg-primary/[0.02]"
          >
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-6 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Document Integrity</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">Securing Local Workspace: {Math.round(progress)}%</p>
            
            <div className="progress-container max-w-sm mx-auto shadow-inner">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-black text-primary/60 uppercase tracking-tighter">
              <Shield className="w-3 h-3" /> End-to-End Local Processing No Data Leak Possible
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`upload-zone relative overflow-hidden group ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
            style={{
              transform: isDragging ? 'scale(1.02)' : 'scale(1)',
              borderColor: isDragging ? 'rgb(99, 102, 241)' : '',
              borderWidth: isDragging ? '3px' : '',
              boxShadow: isDragging ? '0 20px 60px -10px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(99, 102, 241, 0.1)' : ''
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${isDragging ? 'from-primary/20 to-primary-dark/10 opacity-100' : 'from-primary/5 to-transparent opacity-0 group-hover:opacity-100'}`} />
            
            {isDragging && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
              >
                <div className="px-6 py-3 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/50 flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  Drop it like it's hot
                </div>
              </motion.div>
            )}
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10 border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                <FileUp className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                Secure Your Documents
              </h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">
                Drop PDF files or <span className="text-primary underline cursor-pointer">browse</span>
              </p>
              
              <div className="flex items-center justify-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                  <Shield className="w-3 h-3 text-primary" /> Encrypted
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                  <Lock className="w-3 h-3 text-primary" /> Local
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                  <Files className="w-3 h-3 text-primary" /> Private
                </div>
              </div>
            </div>

            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
