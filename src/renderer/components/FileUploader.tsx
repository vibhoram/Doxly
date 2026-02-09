import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { useAppStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function FileUploader() {
  const { addFiles } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (fileInfos: any[]) => {
    setIsProcessing(true);
    
    try {
      const processedFiles = await Promise.all(
        fileInfos.map(async (fileInfo) => {
          const buffer = await window.electronAPI.file.read(fileInfo.path);
          let pages = 0;
          let thumbnail = '';

          if (fileInfo.extension === '.pdf') {
            try {
              pages = await pdfUtils.getPageCount(buffer);
              thumbnail = await pdfUtils.generateThumbnail(buffer);
            } catch (error) {
              console.error('Error processing PDF:', error);
            }
          }

          return {
            id: uuidv4(),
            name: fileInfo.name,
            path: fileInfo.path,
            size: fileInfo.size,
            pages,
            thumbnail,
            selected: false,
            created: new Date()
          };
        })
      );

      addFiles(processedFiles);
      toast.success(`Added ${processedFiles.length} file(s)`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process files');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFiles = async () => {
    const files = await window.electronAPI.file.select({ multiple: true });
    if (files) {
      await processFiles(files);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const fileInfos = files.map((file) => ({
        path: (file as any).path || '',
        name: file.name,
        size: file.size,
        extension: '.' + file.name.split('.').pop()?.toLowerCase()
      }));

      await processFiles(fileInfos);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          max-w-2xl w-full p-16 rounded-2xl
          glass-strong border-2 border-dashed
          ${isDragging ? 'border-primary scale-105' : 'border-gray-400/50 dark:border-gray-600/50'}
          transition-all duration-200 cursor-pointer
        `}
        onClick={!isProcessing ? handleFiles : undefined}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div
            animate={{
              y: isDragging ? -10 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {isProcessing ? (
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-20 h-20 text-primary" strokeWidth={1.5} />
            )}
          </motion.div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {isProcessing ? 'Processing files...' : 'Drop your files here'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              or click to browse • PDF, DOCX, XLSX, PPTX, Images
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Unlimited file size</span>
            </div>
            <span>•</span>
            <div>100% offline & secure</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
