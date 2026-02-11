import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Shield, Loader2, Zap } from 'lucide-react';
import { useAppStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function FileUploader() {
  const { addFiles } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (fileInfos: { name: string; size: number; extension: string; path?: string; file?: File }[]) => {
    // @ts-ignore
    const isElectron = !!window.electronAPI?.file;
    setIsProcessing(true);
    
    try {
      const processedFiles = await Promise.all(
        fileInfos.map(async (info) => {
          let buffer: ArrayBuffer;

          if (isElectron && info.path) {
            // @ts-ignore
            const rawBuffer = await window.electronAPI!.file.read(info.path);
            buffer = rawBuffer.buffer.slice(rawBuffer.byteOffset, rawBuffer.byteOffset + rawBuffer.byteLength);
          } else if (info.file) {
            buffer = await info.file.arrayBuffer();
          } else {
            throw new Error('No file data available');
          }

          let pages = 0;
          let thumbnail = '';

          if (info.extension === '.pdf') {
            try {
              pages = await pdfUtils.getPageCount(buffer);
              thumbnail = await pdfUtils.generateThumbnail(buffer);
            } catch (error) {
              console.error('Error processing PDF info:', error);
            }
          }

          return {
            id: uuidv4(),
            name: info.name,
            path: info.path || '',
            size: info.size,
            pages,
            thumbnail,
            selected: false,
            created: new Date(),
            // PERSISTENCE: Store data for browser mode since we can't re-read by path
            data: isElectron ? undefined : buffer 
          };
        })
      );

      addFiles(processedFiles);
      toast.success(`Loaded ${processedFiles.length} document(s)`);
      if (!isElectron) {
        toast('Running in Browser Mode (Safe but limited)', { icon: '🌐' });
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const fileInfos = files.map((file) => ({
        file: file,
        path: (file as any).path || '',
        name: file.name,
        size: file.size,
        extension: '.' + file.name.split('.').pop()?.toLowerCase()
      }));
      await processFiles(fileInfos);
      e.target.value = '';
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (isProcessing) return;

      const files = Array.from(e.dataTransfer.files);
      const fileInfos = files.map((file) => ({
        file: file,
        path: (file as any).path || '',
        name: file.name,
        size: file.size,
        extension: '.' + file.name.split('.').pop()?.toLowerCase()
      }));

      await processFiles(fileInfos);
    },
    [isProcessing]
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full">
      <motion.div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`
          max-w-2xl w-full p-16 rounded-[3rem]
          glass border-2 border-dashed relative overflow-hidden
          ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-white/10 hover:border-primary/50'}
          transition-all duration-500 cursor-pointer
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex flex-col items-center gap-8 text-center relative z-10">
          <motion.div
            animate={{
              y: isDragging ? -10 : 0,
              rotate: isDragging ? 5 : 0
            }}
          >
            {isProcessing ? (
              <Loader2 className="w-20 h-20 text-primary animate-spin" strokeWidth={1.5} />
            ) : (
              <div className="w-28 h-28 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-2 ring-8 ring-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Upload className="w-12 h-12 text-primary group-hover:text-white transition-colors" strokeWidth={2.5} />
              </div>
            )}
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
              {isProcessing ? 'Forging Content...' : 'Drop PDF files here'}
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              or <span className="text-primary font-bold hover:underline">click to browse</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest leading-none">High Performance</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs font-black uppercase tracking-widest leading-none">100% Private</span>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-pulse" 
            />
          )}
        </AnimatePresence>

        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
          title=""
          value=""
        />
      </motion.div>
    </div>
  );
}
